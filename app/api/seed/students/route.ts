import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Student from "@/models/Student"

// Mock data for students
const studentData = [
  {
    name: "Pierre Durand",
    email: "pierre.durand@etudiant.fr",
    studentId: "20210001",
    program: "Master Informatique",
  },
  {
    name: "Sophie Lefebvre",
    email: "sophie.lefebvre@etudiant.fr",
    studentId: "20210002",
    program: "Master Informatique",
  },
  {
    name: "Lucas Martin",
    email: "lucas.martin@etudiant.fr",
    studentId: "20210003",
    program: "Master Électronique",
  },
  {
    name: "Emma Petit",
    email: "emma.petit@etudiant.fr",
    studentId: "20210004",
    program: "Master Mathématiques",
  },
  {
    name: "Hugo Bernard",
    email: "hugo.bernard@etudiant.fr",
    studentId: "20210005",
    program: "Master Informatique",
  },
  {
    name: "Chloé Dubois",
    email: "chloe.dubois@etudiant.fr",
    studentId: "20210006",
    program: "Master Électronique",
  },
  {
    name: "Léo Moreau",
    email: "leo.moreau@etudiant.fr",
    studentId: "20210007",
    program: "Master Informatique",
  },
  {
    name: "Manon Rousseau",
    email: "manon.rousseau@etudiant.fr",
    studentId: "20210008",
    program: "Master Mathématiques",
  },
  {
    name: "Thomas Girard",
    email: "thomas.girard@etudiant.fr",
    studentId: "20210009",
    program: "Master Informatique",
  },
  {
    name: "Camille Lambert",
    email: "camille.lambert@etudiant.fr",
    studentId: "20210010",
    program: "Master Électronique",
  },
  {
    name: "Nathan Faure",
    email: "nathan.faure@etudiant.fr",
    studentId: "20210011",
    program: "Master Informatique",
  },
  {
    name: "Zoé Mercier",
    email: "zoe.mercier@etudiant.fr",
    studentId: "20210012",
    program: "Master Mathématiques",
  },
]

export async function POST() {
  try {
    await dbConnect()

    // Insert students
    const result = await Student.insertMany(studentData)

    return NextResponse.json({
      message: "Students seeded successfully",
      count: result.length,
    })
  } catch (error) {
    console.error("Error seeding students:", error)
    return NextResponse.json({ error: "Failed to seed students" }, { status: 500 })
  }
}

