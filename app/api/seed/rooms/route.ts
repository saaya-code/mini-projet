import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Room from "@/models/Room"

// Mock data for rooms
const roomData = [
  {
    name: "A101",
    capacity: 30,
    building: "Bâtiment A",
    floor: 1,
    isAvailable: true,
  },
  {
    name: "A102",
    capacity: 25,
    building: "Bâtiment A",
    floor: 1,
    isAvailable: true,
  },
  {
    name: "A201",
    capacity: 20,
    building: "Bâtiment A",
    floor: 2,
    isAvailable: true,
  },
  {
    name: "B101",
    capacity: 35,
    building: "Bâtiment B",
    floor: 1,
    isAvailable: true,
  },
  {
    name: "B102",
    capacity: 15,
    building: "Bâtiment B",
    floor: 1,
    isAvailable: false,
  },
  {
    name: "B201",
    capacity: 40,
    building: "Bâtiment B",
    floor: 2,
    isAvailable: true,
  },
  {
    name: "C101",
    capacity: 30,
    building: "Bâtiment C",
    floor: 1,
    isAvailable: true,
  },
  {
    name: "C201",
    capacity: 25,
    building: "Bâtiment C",
    floor: 2,
    isAvailable: true,
  },
]

export async function POST() {
  try {
    await dbConnect()

    // Insert rooms
    const result = await Room.insertMany(roomData)

    return NextResponse.json({
      message: "Rooms seeded successfully",
      count: result.length,
    })
  } catch (error) {
    console.error("Error seeding rooms:", error)
    return NextResponse.json({ error: "Failed to seed rooms" }, { status: 500 })
  }
}

