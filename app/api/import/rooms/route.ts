import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Room from "@/models/Room"
import { read, utils } from "xlsx"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const workbook = read(buffer)

    // Get the first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Convert to JSON
    const data = utils.sheet_to_json(worksheet)

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No data found in the file" }, { status: 400 })
    }

    // Validate data structure
    for (const row of data) {
      const typedRow = row as any
      if (!typedRow.name || typedRow.capacity === undefined || !typedRow.building || typedRow.floor === undefined) {
        return NextResponse.json(
          { error: "Invalid data format. Required columns: name, capacity, building, floor" },
          { status: 400 },
        )
      }
    }

    // Insert rooms
    let insertedCount = 0

    for (const row of data) {
      const typedRow = row as any

      // Check if room already exists
      const existingRoom = await Room.findOne({ name: typedRow.name })

      if (!existingRoom) {
        await Room.create({
          name: typedRow.name,
          capacity: Number(typedRow.capacity),
          building: typedRow.building,
          floor: Number(typedRow.floor),
          isAvailable:
            typedRow.isAvailable === undefined ? true : String(typedRow.isAvailable).toLowerCase() === "true",
        })
        insertedCount++
      }
    }

    return NextResponse.json({
      message: "Rooms imported successfully",
      count: insertedCount,
    })
  } catch (error) {
    console.error("Error importing rooms:", error)
    return NextResponse.json({ error: "Failed to import rooms" }, { status: 500 })
  }
}
