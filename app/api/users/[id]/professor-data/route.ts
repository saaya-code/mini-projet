import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Professor from "@/models/Professor"
import Project from "@/models/Project"
import Defense from "@/models/Defense"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Cast session.user to include id and role
    const sessionUser = session.user as { id: string; role?: string }

    // Only allow users to access their own data or admins to access any data
    if (sessionUser.id !== resolvedParams.id && sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await dbConnect()

    // Get the user with professor ID
    const user = await User.findById(resolvedParams.id)
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
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch professor data" }, { status: 500 })
  }
}
