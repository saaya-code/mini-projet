import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Room from "@/models/Room"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const id = (await params)?.id;
    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, capacity, building, floor, isAvailable } = body

    if (!name || capacity === undefined || !building || floor === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Check if another room has the same name
    const existingRoom = await Room.findOne({
      _id: { $ne: params.id },
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
      params.id,
      { name, capacity, building, floor, isAvailable },
      { new: true, runValidators: true },
    )

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const id = (await params)?.id;
    const room = await Room.findByIdAndDelete(id);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Room deleted successfully" })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}

