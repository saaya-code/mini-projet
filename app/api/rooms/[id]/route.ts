import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Room from "@/models/Room"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const id = params.id

    await dbConnect()
    const room = await Room.findById(id)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const id = params.id

    const body = await request.json()
    const { name, capacity, building, floor, isAvailable } = body

    if (!name || capacity === undefined || !building || floor === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Check if another room has the same name
    const existingRoom = await Room.findOne({
      _id: { $ne: id },
      name,
    })

    if (existingRoom) {
      return NextResponse.json(
        {
          error: "Une autre salle avec ce nom existe déjà",
        },
        { status: 409 },
      )
    }

    const room = await Room.findByIdAndUpdate(
      id,
      { name, capacity, building, floor, isAvailable },
      { new: true, runValidators: true },
    )

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const id = params.id

    await dbConnect()

    const room = await Room.findByIdAndDelete(id)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Room deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}
