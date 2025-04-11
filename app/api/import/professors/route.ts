/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Professor from "@/models/Professor"
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
      if (!typedRow.name || !typedRow.email || !typedRow.department) {
        return NextResponse.json(
          { error: "Invalid data format. Required columns: name, email, department" },
          { status: 400 },
        )
      }
    }

    // Insert professors
    let insertedCount = 0

    for (const row of data) {
      const typedRow = row as any

      // Check if professor already exists
      const existingProfessor = await Professor.findOne({ email: typedRow.email })

      if (!existingProfessor) {
        await Professor.create({
          name: typedRow.name,
          email: typedRow.email,
          department: typedRow.department,
          availability: [],
        })
        insertedCount++
      }
    }

    return NextResponse.json({
      message: "Professors imported successfully",
      count: insertedCount,
    })
  } catch (error) {
    console.error("Error importing professors:", error)
    return NextResponse.json({ error: "Failed to import professors" }, { status: 500 })
  }
}
