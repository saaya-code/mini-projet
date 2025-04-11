"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function SeedDatabase() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "seeding" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [stats, setStats] = useState({
    professors: 0,
    students: 0,
    projects: 0,
    rooms: 0,
    defenses: 0,
    users: {
      admin: 0,
      professors: 0,
      students: 0,
    },
  })

  const handleSeed = async () => {
    if (isSeeding) return

    setIsSeeding(true)
    setStatus("seeding")
    setProgress(0)
    setMessage("Préparation de la base de données...")

    try {
      // Step 1: Clear existing data
      setProgress(10)
      setMessage("Suppression des données existantes...")
      await fetch("/api/seed/clear", { method: "POST" })

      // Step 2: Seed professors
      setProgress(20)
      setMessage("Création des professeurs...")
      const professorsResponse = await fetch("/api/seed/professors", { method: "POST" })
      const professorsData = await professorsResponse.json()
      setStats((prev) => ({ ...prev, professors: professorsData.count }))

      // Step 3: Seed students
      setProgress(30)
      setMessage("Création des étudiants...")
      const studentsResponse = await fetch("/api/seed/students", { method: "POST" })
      const studentsData = await studentsResponse.json()
      setStats((prev) => ({ ...prev, students: studentsData.count }))

      // Step 4: Seed rooms
      setProgress(40)
      setMessage("Création des salles...")
      const roomsResponse = await fetch("/api/seed/rooms", { method: "POST" })
      const roomsData = await roomsResponse.json()
      setStats((prev) => ({ ...prev, rooms: roomsData.count }))

      // Step 5: Seed projects
      setProgress(50)
      setMessage("Création des projets...")
      const projectsResponse = await fetch("/api/seed/projects", { method: "POST" })
      const projectsData = await projectsResponse.json()
      setStats((prev) => ({ ...prev, projects: projectsData.count }))

      // Step 6: Generate some defenses
      setProgress(70)
      setMessage("Génération des soutenances...")
      const defensesResponse = await fetch("/api/seed/defenses", { method: "POST" })
      const defensesData = await defensesResponse.json()
      setStats((prev) => ({ ...prev, defenses: defensesData.count }))

      // Step 7: Create users
      setProgress(90)
      setMessage("Création des utilisateurs...")
      const usersResponse = await fetch("/api/seed/users", { method: "POST" })
      const usersData = await usersResponse.json()
      setStats((prev) => ({
        ...prev,
        users: {
          admin: usersData.count.admin,
          professors: usersData.count.professors,
          students: usersData.count.students,
        },
      }))

      // Complete
      setProgress(100)
      setMessage("Base de données initialisée avec succès!")
      setStatus("success")
    } catch (error) {
      console.error("Seeding error:", error)
      setStatus("error")
      setMessage("Une erreur est survenue lors de l'initialisation de la base de données.")
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Initialisation de la Base de Données</CardTitle>
        <CardDescription>Créez des données de test pour le système de planification des soutenances</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "idle" && (
          <Alert>
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              Cette action va supprimer toutes les données existantes et les remplacer par des données de test.
              Assurez-vous de ne pas avoir de données importantes avant de continuer.
            </AlertDescription>
          </Alert>
        )}

        {status === "seeding" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>{message}</p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <Alert variant="default" className="border-green-500 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{stats.professors}</p>
                <p className="text-sm text-muted-foreground">Professeurs</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{stats.students}</p>
                <p className="text-sm text-muted-foreground">Étudiants</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{stats.projects}</p>
                <p className="text-sm text-muted-foreground">Projets</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{stats.rooms}</p>
                <p className="text-sm text-muted-foreground">Salles</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{stats.defenses}</p>
                <p className="text-sm text-muted-foreground">Soutenances</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">
                  {stats.users.admin + stats.users.professors + stats.users.students}
                </p>
                <p className="text-sm text-muted-foreground">Utilisateurs</p>
              </div>
            </div>

            <div className="mt-4 p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Identifiants de connexion</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Admin:</span> admin@universite.fr / password123
                </p>
                <p>
                  <span className="font-medium">Professeurs:</span> [email du professeur] / password123
                </p>
                <p>
                  <span className="font-medium">Étudiants:</span> [email de l&apos;étudiant] / password123
                </p>
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSeed} disabled={isSeeding} className="w-full">
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initialisation en cours...
            </>
          ) : status === "success" ? (
            "Réinitialiser la base de données"
          ) : (
            "Initialiser la base de données"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
