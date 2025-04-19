"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { GraduationCap, Mail, User, CalendarDays, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Student {
  _id: string
  name: string
  email: string
  studentId: string
  program: string
}

interface Project {
  _id: string
  title: string
  description: string
  supervisor: {
    name: string
    email: string
  }
}

interface Defense {
  _id: string
  date: string
  startTime: string
  endTime: string
  room: {
    name: string
    building: string
  }
  juryPresident: {
    name: string
  }
  juryReporter: {
    name: string
  }
}

export default function StudentDashboard({ userId }: { userId: string }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [defense, setDefense] = useState<Defense | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/users/${userId}/student-data`)
        if (!response.ok) throw new Error("Failed to fetch student data")

        const data = await response.json()
        setStudent(data.student)
        setProject(data.project)
        setDefense(data.defense)
      } catch (error) {
        toast.error("Impossible de charger vos données")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [userId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px] rounded-lg" />
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    )
  }

  if (!student) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune donnée d'étudiant trouvée pour votre compte.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{student.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{student.program}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>Numéro étudiant: {student.studentId}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Projet de fin d'études</CardTitle>
          </CardHeader>
          <CardContent>
            {project ? (
              <div className="space-y-2">
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="pt-2">
                  <p className="text-sm">
                    <span className="font-medium">Superviseur:</span> {project.supervisor.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Contact:</span> {project.supervisor.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Aucun projet assigné</p>
            )}
          </CardContent>
          {project && (
            <CardFooter>
              <Link href="/student/project" className="w-full">
                <Button variant="outline" className="w-full">
                  Voir les détails du projet
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ma Soutenance</CardTitle>
          <CardDescription>Détails de votre soutenance de fin d'études</CardDescription>
        </CardHeader>
        <CardContent>
          {defense ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Date et Heure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {new Date(defense.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>
                        {defense.startTime} - {defense.endTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Lieu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">Salle {defense.room.name}</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{defense.room.building}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Jury</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Président du jury</p>
                      <p className="text-sm">{defense.juryPresident.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Rapporteur</p>
                      <p className="text-sm">{defense.juryReporter.name}</p>
                    </div>
                    {project && (
                      <div>
                        <p className="text-sm font-medium">Superviseur</p>
                        <p className="text-sm">{project.supervisor.name}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button asChild>
                  <Link href="/student/defense">Voir tous les détails</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aucune soutenance n'a encore été planifiée pour votre projet.
              </p>
              {project ? (
                <Badge variant="outline" className="mx-auto">
                  Projet assigné - En attente de planification
                </Badge>
              ) : (
                <Badge variant="outline" className="mx-auto">
                  Aucun projet assigné
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
