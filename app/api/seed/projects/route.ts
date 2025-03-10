import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Project from "@/models/Project"
import Student from "@/models/Student"
import Professor from "@/models/Professor"

// Project titles and descriptions
const projectTemplates = [
  {
    title: "Développement d'une application web de gestion de projets",
    description:
      "Conception et implémentation d'une application web permettant la gestion de projets collaboratifs avec suivi des tâches, des délais et des ressources.",
  },
  {
    title: "Système de reconnaissance faciale pour le contrôle d'accès",
    description:
      "Développement d'un système de reconnaissance faciale utilisant des techniques d'apprentissage profond pour sécuriser l'accès à des zones restreintes.",
  },
  {
    title: "Analyse de données massives pour la prédiction de la consommation énergétique",
    description:
      "Utilisation de techniques d'analyse de données massives pour prédire la consommation énergétique de bâtiments en fonction de divers paramètres environnementaux.",
  },
  {
    title: "Conception d'un système embarqué pour la domotique",
    description:
      "Développement d'un système embarqué permettant le contrôle intelligent des équipements domestiques (éclairage, chauffage, sécurité).",
  },
  {
    title: "Application mobile de suivi de santé personnalisé",
    description:
      "Création d'une application mobile permettant aux utilisateurs de suivre leurs indicateurs de santé et de recevoir des recommandations personnalisées.",
  },
  {
    title: "Optimisation d'algorithmes de routage pour réseaux de capteurs",
    description:
      "Recherche et implémentation d'algorithmes optimisés pour le routage de données dans des réseaux de capteurs sans fil à faible consommation énergétique.",
  },
  {
    title: "Plateforme d'apprentissage en ligne avec intelligence artificielle",
    description:
      "Développement d'une plateforme e-learning intégrant des algorithmes d'IA pour personnaliser les parcours d'apprentissage en fonction des performances des utilisateurs.",
  },
  {
    title: "Système de détection d'anomalies dans les réseaux informatiques",
    description:
      "Conception d'un système de détection d'intrusions et d'anomalies dans les réseaux informatiques basé sur des techniques d'apprentissage automatique.",
  },
  {
    title: "Modélisation et simulation de phénomènes physiques complexes",
    description:
      "Développement de modèles mathématiques et informatiques pour simuler des phénomènes physiques complexes avec applications dans l'ingénierie.",
  },
  {
    title: "Interface cerveau-machine pour applications médicales",
    description:
      "Recherche et développement d'une interface permettant la communication directe entre le cerveau et un ordinateur pour des applications médicales et d'assistance.",
  },
]

export async function POST() {
  try {
    await dbConnect()

    // Get all students and professors
    const students = await Student.find({})
    const professors = await Professor.find({})

    if (students.length === 0 || professors.length === 0) {
      return NextResponse.json(
        {
          error: "No students or professors found. Please seed them first.",
        },
        { status: 400 },
      )
    }

    // Create projects by assigning students to professors
    const projects = []

    // Use the minimum number of students or project templates
    const projectCount = Math.min(students.length, projectTemplates.length)

    for (let i = 0; i < projectCount; i++) {
      const student = students[i]
      // Assign a random professor as supervisor
      const supervisor = professors[Math.floor(Math.random() * professors.length)]
      const projectTemplate = projectTemplates[i]

      projects.push({
        title: projectTemplate.title,
        description: projectTemplate.description,
        student: student._id,
        supervisor: supervisor._id,
      })
    }

    // Insert projects
    const result = await Project.insertMany(projects)

    return NextResponse.json({
      message: "Projects seeded successfully",
      count: result.length,
    })
  } catch (error) {
    console.error("Error seeding projects:", error)
    return NextResponse.json({ error: "Failed to seed projects" }, { status: 500 })
  }
}

