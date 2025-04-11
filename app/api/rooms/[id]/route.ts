import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Room from "@/models/Room"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect()
    const room = await Room.findById(resolvedParams.id)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json()
    const { name, capacity, building, floor, isAvailable } = body

    if (!name || capacity === undefined || !building || floor === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Check if another room has the same name
    const existingRoom = await Room.findOne({
      _id: { $ne: resolvedParams.id },
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
      resolvedParams.id,
      { name, capacity, building, floor, isAvailable },
      { new: true, runValidators: true },
    )

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await dbConnect()

    const room = await Room.findByIdAndDelete(resolvedParams.id)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Room deleted successfully" })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}
