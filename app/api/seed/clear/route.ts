import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Professor from "@/models/Professor"
import Student from "@/models/Student"
import Project from "@/models/Project"
import Room from "@/models/Room"
import Defense from "@/models/Defense"

export async function POST() {
  try {
    await dbConnect()

    // Delete all data from collections
    await Defense.deleteMany({})
    await Project.deleteMany({})
    await Student.deleteMany({})
    await Professor.deleteMany({})
    await Room.deleteMany({})

    return NextResponse.json({ message: "Database cleared successfully" })
  } catch (error) {
    console.error("Error clearing database:", error)
    return NextResponse.json({ error: "Failed to clear database" }, { status: 500 })
  }
}

