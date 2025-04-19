import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Professor from "@/models/Professor"
import User from "@/models/User"
import { read, utils } from "xlsx"
import { generatePassword, sendWelcomeEmail } from "@/lib/email"

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
    const emailPromises = []

    for (const row of data) {
      const typedRow = row as any

      // Check if professor already exists
      const existingProfessor = await Professor.findOne({ email: typedRow.email })
      const existingUser = await User.findOne({ email: typedRow.email })

      if (!existingProfessor && !existingUser) {
        // Create professor
        const professor = await Professor.create({
          name: typedRow.name,
          email: typedRow.email,
          department: typedRow.department,
          availability: [],
        })

        // Generate password
        const password = generatePassword()

        // Create user
        await User.create({
          name: typedRow.name,
          email: typedRow.email,
          password,
          role: "professor",
          professorId: professor._id,
        })

        // Queue email sending (don't await here to process in parallel)
        emailPromises.push(
          sendWelcomeEmail({
            email: typedRow.email,
            name: typedRow.name,
            password,
            role: "professor",
          }),
        )

        insertedCount++
      }
    }

    // Wait for all emails to be sent
    await Promise.allSettled(emailPromises)

    return NextResponse.json({
      message: "Professors imported successfully",
      count: insertedCount,
    })
  } catch (error) {
    console.error("Error importing professors:", error)
    return NextResponse.json({ error: "Failed to import professors" }, { status: 500 })
  }
}
