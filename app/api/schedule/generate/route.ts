import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Professor from "@/models/Professor"
import Project from "@/models/Project"
import Room from "@/models/Room"
import Defense from "@/models/Defense"
import { createNotificationForProfessor, createNotificationForStudent } from "@/lib/notifications"
import { format, eachDayOfInterval } from "date-fns"
import { fr } from "date-fns/locale"

// Helper function to check if a professor is available at a given time slot
function isProfessorAvailable(professor: any, day: string, startTime: string, endTime: string) {
  return professor.availability.some(
    (slot: any) => slot.day === day && slot.startTime <= startTime && slot.endTime >= endTime,
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
    $or: [{ juryPresident: professorId }, { juryReporter: professorId }],
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
    ],
  })

  return !!existingDefense
}

// Helper function to get the day of the week in French
function getDayOfWeek(date: Date) {
  const dayOfWeek = format(date, "EEEE", { locale: fr })
  return dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
}

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

// Helper function to generate schedule for a single day
async function generateScheduleForDay(date: Date, projects: any[], professors: any[], rooms: any[]) {
  const defenses = []
  const notificationPromises = []
  const dayOfWeek = getDayOfWeek(date)
  const formattedDate = format(date, "EEEE d MMMM yyyy", { locale: fr })

  // For each project, try to schedule a defense
  for (const project of projects) {
    if (!project.needsScheduling) continue // Skip if already scheduled in another day

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
      if (!isProfessorAvailable(supervisor, dayOfWeek, slot.start, slot.end)) {
        continue
      }

      // Try each room
      for (const room of rooms) {
        if (scheduled) break

        // Check if room is available
        const roomAvailable = await isRoomAvailable(room._id, date.toISOString(), slot.start, slot.end)

        if (!roomAvailable) {
          continue
        }

        // Find available jury members
        const availableJuryMembers = []

        for (const prof of availableProfessors) {
          // Check if professor is available at this time slot
          if (!isProfessorAvailable(prof, dayOfWeek, slot.start, slot.end)) {
            continue
          }

          // Check if professor is already assigned to another defense at this time
          const isAssigned = await isProfessorAssignedElsewhere(prof._id, date.toISOString(), slot.start, slot.end)

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
            date: date,
            startTime: slot.start,
            endTime: slot.end,
            room: room._id,
            juryPresident: availableJuryMembers[0]._id,
            juryReporter: availableJuryMembers[1]._id,
          })

          defenses.push(defense)
          scheduled = true
          project.needsScheduling = false // Mark as scheduled

          // Create notifications for all involved parties
          // Notification for the student
          notificationPromises.push(
            createNotificationForStudent({
              studentId: project.student._id.toString(),
              title: "Soutenance planifiée",
              message: `Votre soutenance a été planifiée le ${formattedDate} de ${slot.start} à ${slot.end} en salle ${room.name}.`,
              link: "/student/defense",
            }),
          )

          // Notification for the supervisor
          notificationPromises.push(
            createNotificationForProfessor({
              professorId: supervisor._id.toString(),
              title: "Soutenance planifiée",
              message: `Une soutenance pour le projet "${project.title}" a été planifiée le ${formattedDate} de ${slot.start} à ${slot.end} en salle ${room.name}.`,
              link: "/professor/defenses",
            }),
          )

          // Notification for jury president
          notificationPromises.push(
            createNotificationForProfessor({
              professorId: availableJuryMembers[0]._id.toString(),
              title: "Participation au jury",
              message: `Vous êtes désigné comme président du jury pour la soutenance du projet "${project.title}" le ${formattedDate} de ${slot.start} à ${slot.end} en salle ${room.name}.`,
              link: "/professor/defenses",
            }),
          )

          // Notification for jury reporter
          notificationPromises.push(
            createNotificationForProfessor({
              professorId: availableJuryMembers[1]._id.toString(),
              title: "Participation au jury",
              message: `Vous êtes désigné comme rapporteur pour la soutenance du projet "${project.title}" le ${formattedDate} de ${slot.start} à ${slot.end} en salle ${room.name}.`,
              link: "/professor/defenses",
            }),
          )

          break
        }
      }
    }
  }

  // Process all notification promises
  await Promise.allSettled(notificationPromises)

  return defenses
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, dateRange } = body

    if (!date && !dateRange) {
      return NextResponse.json({ error: "Either date or dateRange is required" }, { status: 400 })
    }

    await dbConnect()

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

    // Add a flag to track which projects have been scheduled
    projects.forEach((project: any) => {
      project.needsScheduling = true
    })

    let allDefenses = []
    let processedDays = 0

    if (date) {
      // Single day mode
      const selectedDate = new Date(date)

      // Clear existing defenses for the selected date
      await Defense.deleteMany({
        date: {
          $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
          $lte: new Date(selectedDate.setHours(23, 59, 59, 999)),
        },
      })

      const defenses = await generateScheduleForDay(new Date(date), projects, professors, rooms)
      allDefenses = defenses
      processedDays = 1
    } else if (dateRange && dateRange.from && dateRange.to) {
      // Date range mode
      const startDate = new Date(dateRange.from)
      const endDate = new Date(dateRange.to)

      // Clear existing defenses for the selected date range
      await Defense.deleteMany({
        date: {
          $gte: new Date(startDate.setHours(0, 0, 0, 0)),
          $lte: new Date(new Date(dateRange.to).setHours(23, 59, 59, 999)),
        },
      })

      // Get all days in the range
      const days = eachDayOfInterval({ start: new Date(dateRange.from), end: new Date(dateRange.to) })

      // Filter out weekends (Saturday and Sunday)
      const workdays = days.filter((day) => {
        const dayNum = day.getDay()
        return dayNum !== 0 && dayNum !== 6 // 0 is Sunday, 6 is Saturday
      })

      processedDays = workdays.length

      // Generate schedule for each day
      for (const day of workdays) {
        const dayDefenses = await generateScheduleForDay(day, projects, professors, rooms)
        allDefenses = [...allDefenses, ...dayDefenses]

        // If all projects are scheduled, we can stop
        if (projects.every((p: any) => !p.needsScheduling)) {
          break
        }
      }
    }

    // Count unscheduled projects
    const unscheduledProjects = projects.filter((p: any) => p.needsScheduling).length

    return NextResponse.json({
      message: "Schedule generated successfully",
      defenses: allDefenses,
      totalDefenses: allDefenses.length,
      totalDays: processedDays,
      unscheduledProjects,
    })
  } catch (error) {
    console.error("Error generating schedule:", error)
    return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 })
  }
}
