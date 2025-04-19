import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Student from "@/models/Student"
import User from "@/models/User"
import { generatePassword, sendWelcomeEmail } from "@/lib/email"

export async function GET() {
  try {
    await dbConnect()
    const students = await Student.find({}).sort({ name: 1 })
    return NextResponse.json(students)
  } catch (error) {
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

    // Check if user with email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create the student
    const student = await Student.create({
      name,
      email,
      studentId,
      program,
    })

    // Generate a random password
    const password = generatePassword()

    // Create a user account for the student
    const user = await User.create({
      name,
      email,
      password, // This will be hashed by the pre-save hook in the User model
      role: "student",
      studentId: student._id,
    })

    // Send welcome email with credentials
    await sendWelcomeEmail({
      email,
      name,
      password,
      role: "student",
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}
