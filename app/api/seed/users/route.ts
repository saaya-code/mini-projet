import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST() {
  try {
    await dbConnect()

    // Create admin user only
    const adminUser = await User.create({
      name: "Admin",
      email: "admin@universite.fr",
      password: "password123",
      role: "admin",
    })

    return NextResponse.json({
      message: "Admin user seeded successfully",
      count: {
        admin: 1,
      },
    })
  } catch (error) {
    console.error("Error seeding users:", error)
    return NextResponse.json({ error: "Failed to seed users" }, { status: 500 })
  }
}
