import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Student from "@/models/Student"

export async function GET() {
  try {
    await dbConnect()
    const students = await Student.find({}).sort({ name: 1 })
    return NextResponse.json(students)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, studentId, program } = body

    if (!name || !email || !studentId || !program) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Check if student with email or studentId already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { studentId }],
    })

    if (existingStudent) {
      return NextResponse.json(
        {
          error: "Un étudiant avec cet email ou ce numéro d'étudiant existe déjà",
        },
        { status: 409 },
      )
    }

    const student = await Student.create({
      name,
      email,
      studentId,
      program,
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}
