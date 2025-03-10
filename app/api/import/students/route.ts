import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Student from "@/models/Student"
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedRow = row as any
      if (!typedRow.name || !typedRow.email || !typedRow.studentId || !typedRow.program) {
        return NextResponse.json(
          { error: "Invalid data format. Required columns: name, email, studentId, program" },
          { status: 400 },
        )
      }
    }

    // Insert students
    let insertedCount = 0

    for (const row of data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedRow = row as any

      // Check if student already exists
      const existingStudent = await Student.findOne({
        $or: [{ email: typedRow.email }, { studentId: typedRow.studentId }],
      })

      if (!existingStudent) {
        await Student.create({
          name: typedRow.name,
          email: typedRow.email,
          studentId: typedRow.studentId,
          program: typedRow.program,
        })
        insertedCount++
      }
    }

    return NextResponse.json({
      message: "Students imported successfully",
      count: insertedCount,
    })
  } catch (error) {
    console.error("Error importing students:", error)
    return NextResponse.json({ error: "Failed to import students" }, { status: 500 })
  }
}

