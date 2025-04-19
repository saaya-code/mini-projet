"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { CalendarDays, Clock, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

interface Project {
  supervisor: {
    name: string
  }
}

export function StudentDefenseView({ userId }: { userId: string }) {
  const [defense, setDefense] = useState<Defense | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDefenseData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/student-data`)
        if (!response.ok) throw new Error("Failed to fetch student data")

        const data = await response.json()
        setDefense(data.defense)
        setProject(data.project)
      } catch (error) {
        toast.error("Impossible de charger les données de la soutenance")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDefenseData()
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ma soutenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!defense) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Aucune soutenance planifiée</h3>
          <p className="text-muted-foreground mb-4">Votre soutenance de fin d'études n'a pas encore été planifiée.</p>
          {project ? (
            <Badge variant="outline" className="mx-auto">
              Projet assigné - En attente de planification
            </Badge>
          ) : (
            <Badge variant="outline" className="mx-auto">
              Aucun projet assigné
            </Badge>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Date et lieu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Date</p>
              <p>
                {new Date(defense.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Horaire</p>
              <p>
                {defense.startTime} - {defense.endTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Salle</p>
              <p>
                {defense.room.name}, {defense.room.building}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jury</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <p className="font-medium">Président du jury</p>
                  <p className="text-sm">{defense.juryPresident.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <p className="font-medium">Rapporteur</p>
                  <p className="text-sm">{defense.juryReporter.name}</p>
                </div>
              </CardContent>
            </Card>

            {project && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <Users className="h-8 w-8 mb-2 text-primary" />
                    <p className="font-medium">Superviseur</p>
                    <p className="text-sm">{project.supervisor.name}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Veuillez arriver au moins 15 minutes avant le début de votre soutenance.</li>
            <li>Préparez une présentation de 20 minutes maximum.</li>
            <li>La session de questions-réponses durera environ 10 minutes.</li>
            <li>N'oubliez pas d'apporter votre ordinateur portable et tout matériel nécessaire.</li>
            <li>Habillez-vous de manière professionnelle pour cette occasion.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
