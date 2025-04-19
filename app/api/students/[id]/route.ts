import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Student from "@/models/Student"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const id = params.id

    await dbConnect()
    const student = await Student.findById(id)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const id = params.id

    const body = await request.json()
    const { name, email, studentId, program } = body

    if (!name || !email || !studentId || !program) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Check if another student has the same email or studentId
    const existingStudent = await Student.findOne({
      _id: { $ne: id },
      $or: [{ email }, { studentId }],
    })

    if (existingStudent) {
      return NextResponse.json(
        {
          error: "Un autre étudiant avec cet email ou ce numéro d'étudiant existe déjà",
        },
        { status: 409 },
      )
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { name, email, studentId, program },
      { new: true, runValidators: true },
    )

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const id = params.id

    await dbConnect()

    const student = await Student.findByIdAndDelete(id)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}
