import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Project from "@/models/Project"
import Student from "@/models/Student"
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedRow = row as any
      if (!typedRow.title || !typedRow.description || !typedRow.studentEmail || !typedRow.supervisorEmail) {
        return NextResponse.json(
          { error: "Invalid data format. Required columns: title, description, studentEmail, supervisorEmail" },
          { status: 400 },
        )
      }
    }

    // Insert projects
    let insertedCount = 0
    const errors = []

    for (const row of data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedRow = row as any

      try {
        // Find student and supervisor
        const student = await Student.findOne({ email: typedRow.studentEmail })
        const supervisor = await Professor.findOne({ email: typedRow.supervisorEmail })

        if (!student) {
          errors.push(`Student with email ${typedRow.studentEmail} not found`)
          continue
        }

        if (!supervisor) {
          errors.push(`Professor with email ${typedRow.supervisorEmail} not found`)
          continue
        }

        // Check if project already exists for this student
        const existingProject = await Project.findOne({ student: student._id })

        if (!existingProject) {
          await Project.create({
            title: typedRow.title,
            description: typedRow.description,
            student: student._id,
            supervisor: supervisor._id,
          })
          insertedCount++
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        errors.push(`Error processing row: ${JSON.stringify(typedRow)}`)
      }
    }

    return NextResponse.json({
      message: "Projects imported successfully",
      count: insertedCount,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Error importing projects:", error)
    return NextResponse.json({ error: "Failed to import projects" }, { status: 500 })
  }
}

