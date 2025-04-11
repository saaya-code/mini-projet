import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Room from "@/models/Room"

export async function GET() {
  try {
    await dbConnect()
    const rooms = await Room.find({}).sort({ building: 1, floor: 1, name: 1 })
    return NextResponse.json(rooms)
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, capacity, building, floor, isAvailable } = body

    if (!name || capacity === undefined || !building || floor === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Check if room with name already exists
    const existingRoom = await Room.findOne({ name })
    if (existingRoom) {
      return NextResponse.json(
        {
          error: "Une salle avec ce nom existe déjà",
        },
        { status: 409 },
      )
    }

    const room = await Room.create({
      name,
      capacity,
      building,
      floor,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
