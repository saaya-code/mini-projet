"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Mail, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Professor {
  _id: string
  name: string
  email: string
  department: string
  availability: {
    day: string
    startTime: string
    endTime: string
  }[]
}

interface Defense {
  _id: string
  date: string
  startTime: string
  endTime: string
  room: {
    name: string
  }
  project: {
    title: string
    student: {
      name: string
      email: string
    }
  }
}

export default function ProfessorDashboard({ userId }: { userId: string }) {
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [supervisedDefenses, setSupervisedDefenses] = useState<Defense[]>([])
  const [juryDefenses, setJuryDefenses] = useState<Defense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfessorData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/users/${userId}/professor-data`)
        if (!response.ok) throw new Error("Failed to fetch professor data")

        const data = await response.json()
        setProfessor(data.professor)
        setSupervisedDefenses(data.supervisedDefenses)
        setJuryDefenses(data.juryDefenses)
      } catch (error) {
        toast.error("Impossible de charger vos données")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfessorData()
  }, [userId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[200px] rounded-lg" />
          <Skeleton className="h-[200px] rounded-lg" />
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    )
  }

  if (!professor) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune donnée de professeur trouvée pour votre compte.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{professor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{professor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{professor.department}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/professor/profile" className="w-full">
              <Button variant="outline" className="w-full">
                Modifier mon profil
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Disponibilités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {professor.availability.length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucune disponibilité définie</p>
              ) : (
                professor.availability.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {slot.day}, {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/professor/availability" className="w-full">
              <Button variant="outline" className="w-full">
                Gérer mes disponibilités
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Soutenances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Projets supervisés:</span>
                <Badge variant="outline">{supervisedDefenses.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Participation au jury:</span>
                <Badge variant="outline">{juryDefenses.length}</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/professor/defenses" className="w-full">
              <Button variant="outline" className="w-full">
                Voir mes soutenances
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes Soutenances</CardTitle>
          <CardDescription>Soutenances à venir où vous êtes impliqué</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="supervised">
            <TabsList className="mb-4">
              <TabsTrigger value="supervised">Projets supervisés</TabsTrigger>
              <TabsTrigger value="jury">Participation au jury</TabsTrigger>
            </TabsList>

            <TabsContent value="supervised">
              {supervisedDefenses.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Aucune soutenance planifiée pour vos projets supervisés.
                </p>
              ) : (
                <div className="space-y-4">
                  {supervisedDefenses.map((defense) => (
                    <Card key={defense._id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="font-medium">{defense.project.title}</h3>
                            <p className="text-sm text-muted-foreground">Étudiant: {defense.project.student.name}</p>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-1">
                            <Badge variant="outline" className="mb-1">
                              {new Date(defense.date).toLocaleDateString("fr-FR")}
                            </Badge>
                            <span className="text-sm">
                              {defense.startTime} - {defense.endTime}, Salle {defense.room.name}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="jury">
              {juryDefenses.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Aucune participation au jury planifiée.</p>
              ) : (
                <div className="space-y-4">
                  {juryDefenses.map((defense) => (
                    <Card key={defense._id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="font-medium">{defense.project.title}</h3>
                            <p className="text-sm text-muted-foreground">Étudiant: {defense.project.student.name}</p>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-1">
                            <Badge variant="outline" className="mb-1">
                              {new Date(defense.date).toLocaleDateString("fr-FR")}
                            </Badge>
                            <span className="text-sm">
                              {defense.startTime} - {defense.endTime}, Salle {defense.room.name}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`mailto:${defense.project.student.email}`}>Contacter l'étudiant</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
