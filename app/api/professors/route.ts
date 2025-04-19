import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Professor from "@/models/Professor"
import User from "@/models/User"
import { generatePassword, sendWelcomeEmail } from "@/lib/email"

export async function GET() {
  try {
    await dbConnect()
    const professors = await Professor.find({}).sort({ name: 1 })
    return NextResponse.json(professors)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch professors" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, department } = body

    if (!name || !email || !department) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Check if professor with email already exists
    const existingProfessor = await Professor.findOne({ email })
    if (existingProfessor) {
      return NextResponse.json({ error: "Professor with this email already exists" }, { status: 409 })
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create the professor
    const professor = await Professor.create({
      name,
      email,
      department,
      availability: [],
    })

    // Generate a random password
    const password = generatePassword()

    // Create a user account for the professor
    const user = await User.create({
      name,
      email,
      password, // This will be hashed by the pre-save hook in the User model
      role: "professor",
      professorId: professor._id,
    })

    // Send welcome email with credentials
    await sendWelcomeEmail({
      email,
      name,
      password,
      role: "professor",
    })

    return NextResponse.json(professor, { status: 201 })
  } catch (error) {
    console.error("Error creating professor:", error)
    return NextResponse.json({ error: "Failed to create professor" }, { status: 500 })
  }
}
