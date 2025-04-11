import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Project from "@/models/Project"
import Student from "@/models/Student"
import Professor from "@/models/Professor"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect()
    const project = await Project.findById(resolvedParams.id).populate("student", "name").populate("supervisor", "name")

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json()
    const { title, description, student, supervisor } = body

    if (!title || !description || !student || !supervisor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Verify student and supervisor exist
    const studentExists = await Student.findById(student)
    const supervisorExists = await Professor.findById(supervisor)

    if (!studentExists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    if (!supervisorExists) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 })
    }

    // Check if another student already has a project (excluding current project)
    const existingProject = await Project.findOne({
      _id: { $ne: resolvedParams.id },
      student,
    })

    if (existingProject) {
      return NextResponse.json(
        {
          error: "Cet étudiant a déjà un projet assigné",
        },
        { status: 409 },
      )
    }

    const project = await Project.findByIdAndUpdate(
      resolvedParams.id,
      { title, description, student, supervisor },
      { new: true, runValidators: true },
    )

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect()

    const project = await Project.findByIdAndDelete(resolvedParams.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 }) 

  } 
}


