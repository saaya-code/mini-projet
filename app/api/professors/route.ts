import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Professor from "@/models/Professor"

export async function GET() {
  try {
    await dbConnect()
    const professors = await Professor.find({}).sort({ name: 1 })
    return NextResponse.json(professors)
  } catch (error) {
    console.log(error);
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

    const professor = await Professor.create({
      name,
      email,
      department,
      availability: [],
    })

    return NextResponse.json(professor, { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to create professor" }, { status: 500 })
  }
}
