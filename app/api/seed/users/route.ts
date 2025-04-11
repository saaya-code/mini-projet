import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Professor from "@/models/Professor"
import Student from "@/models/Student"

export async function POST() {
  try {
    await dbConnect()

    // Get all professors and students
    const professors = await Professor.find({})
    const students = await Student.find({})

    // Create admin user
    await User.create({
      name: "admin",
      email: "admin@gmail.com",
      password: "admin",
      role: "admin",
    })

    // Create professor users
    const professorUsers = []
    for (const professor of professors) {
      const user = await User.create({
        name: professor.name,
        email: professor.email,
        password: "password123",
        role: "professor",
        professorId: professor._id,
      })
      professorUsers.push(user)
    }

    // Create student users
    const studentUsers = []
    for (const student of students) {
      const user = await User.create({
        name: student.name,
        email: student.email,
        password: "password123",
        role: "student",
        studentId: student._id,
      })
      studentUsers.push(user)
    }

    return NextResponse.json({
      message: "Users seeded successfully",
      count: {
        admin: 1,
        professors: professorUsers.length,
        students: studentUsers.length,
      },
    })
  } catch (error) {
    console.error("Error seeding users:", error)
    return NextResponse.json({ error: "Failed to seed users" }, { status: 500 })
  }
}
