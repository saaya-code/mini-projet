import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Project from "@/models/Project"
import Student from "@/models/Student"
import Professor from "@/models/Professor"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const id = (await params)?.id; 
    const project = await Project.findById(id).populate("student", "name").populate("supervisor", "name")

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
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
    const id = (await params)?.id;
    // Check if another student already has a project (excluding current project)
    const existingProject = await Project.findOne({
      _id: { $ne: id },
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
      id,
      { title, description, student, supervisor },
      { new: true, runValidators: true },
    )

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const id = (await params)?.id;
    const project = await Project.findByIdAndDelete(id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}

