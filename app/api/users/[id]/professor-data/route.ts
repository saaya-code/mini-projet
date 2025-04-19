import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Professor from "@/models/Professor"
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

    // Get the user with professor ID
    const user = await User.findById(userId)
    if (!user || !user.professorId) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 })
    }

    // Get professor data
    const professor = await Professor.findById(user.professorId)
    if (!professor) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 })
    }

    // Get projects supervised by this professor
    const supervisedProjects = await Project.find({ supervisor: professor._id })
    const supervisedProjectIds = supervisedProjects.map((project) => project._id)

    // Get defenses where professor is supervisor
    const supervisedDefenses = await Defense.find({ project: { $in: supervisedProjectIds } })
      .populate({
        path: "project",
        populate: { path: "student", select: "name email" },
      })
      .populate("room", "name")
      .sort({ date: 1 })

    // Get defenses where professor is in jury
    const juryDefenses = await Defense.find({
      $or: [{ juryPresident: professor._id }, { juryReporter: professor._id }],
      project: { $nin: supervisedProjectIds }, // Exclude supervised projects
    })
      .populate({
        path: "project",
        populate: { path: "student", select: "name email" },
      })
      .populate("room", "name")
      .sort({ date: 1 })

    return NextResponse.json({
      professor,
      supervisedDefenses,
      juryDefenses,
    })
  } catch (error) {
    console.error("Error fetching professor data:", error)
    return NextResponse.json({ error: "Failed to fetch professor data" }, { status: 500 })
  }
}
