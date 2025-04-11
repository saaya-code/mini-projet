import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Professor from "@/models/Professor"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const id = (await params)?.id;
    const professor = await Professor.findById(id)

    if (!professor) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 })
    }

    return NextResponse.json(professor)
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: "Failed to fetch professor" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { name, email, department } = body

    if (!name || !email || !department) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const id = (await params)?.id;

    await dbConnect()

    const professor = await Professor.findByIdAndUpdate(
      id,
      { name, email, department },
      { new: true, runValidators: true },
    )

    if (!professor) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 })
    }

    return NextResponse.json(professor)
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: "Failed to update professor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params)?.id;
    await dbConnect()

    const professor = await Professor.findByIdAndDelete(id)

    if (!professor) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Professor deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete professor" }, { status: 500 })
  }
}

