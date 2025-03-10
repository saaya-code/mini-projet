import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Project from "@/models/Project"
import Student from "@/models/Student"
import Professor from "@/models/Professor"

export async function GET() {
  try {
    await dbConnect()
    const projects = await Project.find({})
      .populate("student", "name")
      .populate("supervisor", "name")
      .sort({ title: 1 })
    return NextResponse.json(projects)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    // Check if student already has a project
    const existingProject = await Project.findOne({ student })
    if (existingProject) {
      return NextResponse.json(
        {
          error: "Cet étudiant a déjà un projet assigné",
        },
        { status: 409 },
      )
    }

    const project = await Project.create({
      title,
      description,
      student,
      supervisor,
    })

    return NextResponse.json(project, { status: 201 })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

