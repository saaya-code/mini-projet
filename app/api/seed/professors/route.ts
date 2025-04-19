import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Professor from "@/models/Professor"
import User from "@/models/User"
import { generatePassword, sendWelcomeEmail } from "@/lib/email"

// Mock data for professors
const professorData = [
  {
    name: "Dr. Jean Dupont",
    email: "jean.dupont@universite.fr",
    department: "Informatique",
    availability: [
      { day: "Lundi", startTime: "09:00", endTime: "12:00" },
      { day: "Lundi", startTime: "14:00", endTime: "17:00" },
      { day: "Mercredi", startTime: "09:00", endTime: "12:00" },
    ],
  },
  {
    name: "Dr. Marie Martin",
    email: "marie.martin@universite.fr",
    department: "Mathématiques",

    availability: [
      { day: "Mardi", startTime: "09:00", endTime: "12:00" },
      { day: "Jeudi", startTime: "14:00", endTime: "17:00" },
    ],
  },
  {
    name: "Dr. Philippe Leclerc",
    email: "philippe.leclerc@universite.fr",
    department: "Informatique",
    availability: [
      { day: "Lundi", startTime: "14:00", endTime: "17:00" },
      { day: "Vendredi", startTime: "09:00", endTime: "12:00" },
    ],
  },
  {
    name: "Dr. Sophie Dubois",
    email: "sophie.dubois@universite.fr",
    department: "Électronique",
    availability: [
      { day: "Mardi", startTime: "14:00", endTime: "17:00" },
      { day: "Jeudi", startTime: "09:00", endTime: "12:00" },
    ],
  },
  {
    name: "Dr. Thomas Moreau",
    email: "thomas.moreau@universite.fr",
    department: "Informatique",
    availability: [
      { day: "Mercredi", startTime: "14:00", endTime: "17:00" },
      { day: "Vendredi", startTime: "14:00", endTime: "17:00" },
    ],
  },
  {
    name: "Dr. Claire Petit",
    email: "claire.petit@universite.fr",
    department: "Mathématiques",
    availability: [
      { day: "Lundi", startTime: "09:00", endTime: "12:00" },
      { day: "Jeudi", startTime: "14:00", endTime: "17:00" },
    ],
  },
  {
    name: "Dr. Antoine Bernard",
    email: "antoine.bernard@universite.fr",
    department: "Électronique",
    availability: [
      { day: "Mardi", startTime: "09:00", endTime: "12:00" },
      { day: "Vendredi", startTime: "09:00", endTime: "12:00" },
    ],
  },
  {
    name: "Dr. Émilie Rousseau",
    email: "emilie.rousseau@universite.fr",
    department: "Informatique",
    availability: [
      { day: "Mercredi", startTime: "09:00", endTime: "12:00" },
      { day: "Jeudi", startTime: "09:00", endTime: "12:00" },
    ],
  },
  {
    name: "Dr. Laurent Girard",
    email: "laurent.girard@universite.fr",
    department: "Informatique",
    availability: [
      { day: "Lundi", startTime: "09:00", endTime: "12:00" },
      { day: "Mardi", startTime: "14:00", endTime: "17:00" },
    ],
  },
  {
    name: "Dr. Nathalie Leroy",
    email: "nathalie.leroy@universite.fr",
    department: "Mathématiques",
    availability: [
      { day: "Mercredi", startTime: "09:00", endTime: "12:00" },
      { day: "Vendredi", startTime: "14:00", endTime: "17:00" },
    ],
  },
  {
    name: "Dr. Michel Fournier",
    email: "michel.fournier@universite.fr",
    department: "Physique",
    availability: [
      { day: "Mardi", startTime: "09:00", endTime: "12:00" },
      { day: "Jeudi", startTime: "14:00", endTime: "17:00" },
    ],
  },
  {
    name: "Dr. Isabelle Mercier",
    email: "isabelle.mercier@universite.fr",
    department: "Chimie",
    availability: [
      { day: "Lundi", startTime: "14:00", endTime: "17:00" },
      { day: "Mercredi", startTime: "09:00", endTime: "12:00" },
    ],
  },
  {
    name: "Dr. François Blanc",
    email: "francois.blanc@universite.fr",
    department: "Informatique",
    availability: [
      { day: "Jeudi", startTime: "09:00", endTime: "12:00" },
      { day: "Vendredi", startTime: "14:00", endTime: "17:00" },
    ],
  },
  {
    name: "Dr. Aurélie Roux",
    email: "aurelie.roux@universite.fr",
    department: "Électronique",
    availability: [
      { day: "Mardi", startTime: "09:00", endTime: "12:00" },
      { day: "Jeudi", startTime: "14:00", endTime: "17:00" },
    ],
  },
  {
    name: "Dr. Julien Fabre",
    email: "julien.fabre@universite.fr",
    department: "Mathématiques",
    availability: [
      { day: "Lundi", startTime: "09:00", endTime: "12:00" },
      { day: "Mercredi", startTime: "14:00", endTime: "17:00" },
    ],
  },
]

export async function POST() {
  try {
    await dbConnect()

    // Insert professors
    const result = []
    const emailPromises = []

    for (const data of professorData) {
      // Create professor
      const professor = await Professor.create(data)
      result.push(professor)

      // Generate password
      const password = generatePassword()

      // Create user
      await User.create({
        name: data.name,
        email: data.email,
        password,
        role: "professor",
        professorId: professor._id,
      })

      // Queue email sending
      emailPromises.push(
        sendWelcomeEmail({
          email: data.email,
          name: data.name,
          password,
          role: "professor",
        }),
      )
    }

    // Wait for all emails to be sent
    await Promise.allSettled(emailPromises)

    return NextResponse.json({
      message: "Professors seeded successfully",
      count: result.length,
    })
  } catch (error) {
    console.error("Error seeding professors:", error)
    return NextResponse.json({ error: "Failed to seed professors" }, { status: 500 })
  }
}
