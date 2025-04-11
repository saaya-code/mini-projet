import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Professor, { type IProfessor, TimeSlot } from "@/models/Professor"
import Project from "@/models/Project"
import Room from "@/models/Room"
import Defense from "@/models/Defense"

// Helper function to check if a professor is available at a given time slot
function isProfessorAvailable(professor: IProfessor, day: string, startTime: string, endTime: string) {
  return professor.availability.some(
    (slot: TimeSlot) => slot.day === day && slot.startTime <= startTime && slot.endTime >= endTime,
  )
}

// Helper function to check if a room is available at a given time slot
async function isRoomAvailable(roomId: string, date: string, startTime: string, endTime: string) {
  const existingDefense = await Defense.findOne({
    room: roomId,
    date,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
    ],
  })

  return !existingDefense
}

// Helper function to check if a professor is already assigned to another defense at the same time
async function isProfessorAssignedElsewhere(professorId: string, date: string, startTime: string, endTime: string) {
  const existingDefense = await Defense.findOne({
    date,
    $and: [
      { $or: [{ juryPresident: professorId }, { juryReporter: professorId }] },
      { $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        ] 
      }
    ]
  })

  return !!existingDefense
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date } = body

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    await dbConnect()

    // Clear existing defenses for the selected date
    await Defense.deleteMany({ date: new Date(date) })

    // Get all projects, professors, and rooms
    const projects = await Project.find({}).populate("student supervisor")
    const professors = await Professor.find({})
    const rooms = await Room.find({ isAvailable: true })

    if (projects.length === 0) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 })
    }

    if (professors.length < 3) {
      return NextResponse.json({ error: "Not enough professors available" }, { status: 400 })
    }

    if (rooms.length === 0) {
      return NextResponse.json({ error: "No rooms available" }, { status: 400 })
    }

    // Get the day of the week
    const dayOfWeek = new Date(date).toLocaleDateString("fr-FR", { weekday: "long" })
    const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)

    // Define time slots (30 minutes per defense with 15 minutes break)
    const timeSlots = [
      { start: "09:00", end: "09:30" },
      { start: "09:45", end: "10:15" },
      { start: "10:30", end: "11:00" },
      { start: "11:15", end: "11:45" },
      { start: "13:00", end: "13:30" },
      { start: "13:45", end: "14:15" },
      { start: "14:30", end: "15:00" },
      { start: "15:15", end: "15:45" },
      { start: "16:00", end: "16:30" },
      { start: "16:45", end: "17:15" },
    ]

    const defenses = []

    // For each project, try to schedule a defense
    for (const project of projects) {
      const supervisor = project.supervisor

      // Find available professors (excluding the supervisor)
      const availableProfessors = professors.filter((prof) => prof._id.toString() !== supervisor._id.toString())

      if (availableProfessors.length < 2) {
        continue // Skip this project if not enough professors are available
      }

      let scheduled = false

      // Try each time slot
      for (const slot of timeSlots) {
        if (scheduled) break

        // Check if supervisor is available
        if (!isProfessorAvailable(supervisor, capitalizedDay, slot.start, slot.end)) {
          continue
        }

        // Try each room
        for (const room of rooms) {
          if (scheduled) break

          // Check if room is available
          const roomAvailable = await isRoomAvailable(room._id, new Date(date).toISOString(), slot.start, slot.end)

          if (!roomAvailable) {
            continue
          }

          // Find available jury members
          const availableJuryMembers = []

          for (const prof of availableProfessors) {
            // Check if professor is available at this time slot
            if (!isProfessorAvailable(prof, capitalizedDay, slot.start, slot.end)) {
              continue
            }

            // Check if professor is already assigned to another defense at this time
            const isAssigned = await isProfessorAssignedElsewhere(
              prof._id,
              new Date(date).toISOString(),
              slot.start,
              slot.end,
            )

            if (isAssigned) {
              continue
            }

            availableJuryMembers.push(prof)

            if (availableJuryMembers.length === 2) {
              break
            }
          }

          if (availableJuryMembers.length === 2) {
            // Create a new defense
            const defense = await Defense.create({
              project: project._id,
              date: new Date(date),
              startTime: slot.start,
              endTime: slot.end,
              room: room._id,
              juryPresident: availableJuryMembers[0]._id,
              juryReporter: availableJuryMembers[1]._id,
            })

            defenses.push(defense)
            scheduled = true
            break
          }
        }
      }
    }

    return NextResponse.json({
      message: "Schedule generated successfully",
      defenses,
    })
  } catch (error) {
    console.error("Error generating schedule:", error)
    return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 })
  }
}
