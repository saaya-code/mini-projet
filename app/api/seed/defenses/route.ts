import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Defense from "@/models/Defense"
import Project from "@/models/Project"
import Professor from "@/models/Professor"
import Room from "@/models/Room"

export async function POST() {
  try {
    await dbConnect()

    // Get all projects, professors, and available rooms
    const projects = await Project.find({}).populate("supervisor")
    const professors = await Professor.find({})
    const rooms = await Room.find({ isAvailable: true })

    if (projects.length === 0 || professors.length < 3 || rooms.length === 0) {
      return NextResponse.json(
        {
          error: "Not enough data to create defenses. Please seed projects, professors, and rooms first.",
        },
        { status: 400 },
      )
    }

    // Create defenses for a future date (2 weeks from now)
    const defenseDate = new Date()
    defenseDate.setDate(defenseDate.getDate() + 14)

    // Make sure it's a weekday (Monday-Friday)
    while (defenseDate.getDay() === 0 || defenseDate.getDay() === 6) {
      defenseDate.setDate(defenseDate.getDate() + 1)
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
    ]

    const defenses = []

    // Create defenses for each project (or as many as possible)
    for (let i = 0; i < Math.min(projects.length, timeSlots.length * rooms.length); i++) {
      const project = projects[i]
      const supervisor = project.supervisor

      // Select room and time slot based on index
      const roomIndex = Math.floor(i / timeSlots.length)
      const timeSlotIndex = i % timeSlots.length

      if (roomIndex >= rooms.length) {
        break // No more rooms available
      }

      const room = rooms[roomIndex]
      const timeSlot = timeSlots[timeSlotIndex]

      // Select jury members (excluding the supervisor)
      const availableJuryMembers = professors.filter((prof) => prof._id.toString() !== supervisor._id.toString())

      if (availableJuryMembers.length < 2) {
        continue // Not enough professors for jury
      }

      // Randomly select jury president and reporter
      const shuffledJury = availableJuryMembers.sort(() => 0.5 - Math.random())
      const juryPresident = shuffledJury[0]
      const juryReporter = shuffledJury[1]

      defenses.push({
        project: project._id,
        date: defenseDate,
        startTime: timeSlot.start,
        endTime: timeSlot.end,
        room: room._id,
        juryPresident: juryPresident._id,
        juryReporter: juryReporter._id,
      })
    }

    // Insert defenses
    const result = await Defense.insertMany(defenses)

    return NextResponse.json({
      message: "Defenses seeded successfully",
      count: result.length,
    })
  } catch (error) {
    console.error("Error seeding defenses:", error)
    return NextResponse.json({ error: "Failed to seed defenses" }, { status: 500 })
  }
}

