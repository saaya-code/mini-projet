import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Student from "@/models/Student"
import Project from "@/models/Project"
import Defense from "@/models/Defense"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params object before accessing its properties
    const params = await context.params
    const userId = params.id

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow users to access their own data or admins to access any data
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await dbConnect()

    // Get the user with student ID
    const user = await User.findById(userId)
    if (!user || !user.studentId) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get student data
    const student = await Student.findById(user.studentId)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get project for this student
    const project = await Project.findOne({ student: student._id }).populate("supervisor", "name email")

    // Get defense for this student's project
    let defense = null
    if (project) {
      defense = await Defense.findOne({ project: project._id })
        .populate("room", "name building")
        .populate("juryPresident", "name")
        .populate("juryReporter", "name")
    }

    return NextResponse.json({
      student,
      project,
      defense,
    })
  } catch (error) {
    console.error("Error fetching student data:", error)
    return NextResponse.json({ error: "Failed to fetch student data" }, { status: 500 })
  }
}
