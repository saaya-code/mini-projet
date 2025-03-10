import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Professor from "@/models/Professor"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { availability } = body
    const id = (await params)?.id;
    if (!availability || !Array.isArray(availability)) {
      return NextResponse.json({ error: "Invalid availability data" }, { status: 400 })
    }

    await dbConnect()

    const professor = await Professor.findByIdAndUpdate(id, { availability }, { new: true, runValidators: true })

    if (!professor) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 })
    }

    return NextResponse.json(professor)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 })
  }
}

