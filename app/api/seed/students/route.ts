import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
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
  {
    name: "Maxime Leroy",
    email: "maxime.leroy@etudiant.fr",
    studentId: "20210013",
    program: "Master Informatique",
  },
  {
    name: "Inès Fournier",
    email: "ines.fournier@etudiant.fr",
    studentId: "20210014",
    program: "Master Électronique",
  },
  {
    name: "Louis Morel",
    email: "louis.morel@etudiant.fr",
    studentId: "20210015",
    program: "Master Mathématiques",
  },
  {
    name: "Jade Bonnet",
    email: "jade.bonnet@etudiant.fr",
    studentId: "20210016",
    program: "Master Informatique",
  },
  {
    name: "Gabriel Dupuis",
    email: "gabriel.dupuis@etudiant.fr",
    studentId: "20210017",
    program: "Master Électronique",
  },
  {
    name: "Léa Fontaine",
    email: "lea.fontaine@etudiant.fr",
    studentId: "20210018",
    program: "Master Informatique",
  },
  {
    name: "Raphaël Roussel",
    email: "raphael.roussel@etudiant.fr",
    studentId: "20210019",
    program: "Master Mathématiques",
  },
  {
    name: "Alice Caron",
    email: "alice.caron@etudiant.fr",
    studentId: "20210020",
    program: "Master Informatique",
  },
  {
    name: "Jules Meunier",
    email: "jules.meunier@etudiant.fr",
    studentId: "20210021",
    program: "Master Électronique",
  },
  {
    name: "Louise Garnier",
    email: "louise.garnier@etudiant.fr",
    studentId: "20210022",
    program: "Master Informatique",
  },
  {
    name: "Adam Perrin",
    email: "adam.perrin@etudiant.fr",
    studentId: "20210023",
    program: "Master Mathématiques",
  },
  {
    name: "Eva Guerin",
    email: "eva.guerin@etudiant.fr",
    studentId: "20210024",
    program: "Master Informatique",
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
