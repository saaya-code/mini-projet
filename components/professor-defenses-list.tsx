"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"

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

export function ProfessorDefensesList({ userId }: { userId: string }) {
  const [supervisedDefenses, setSupervisedDefenses] = useState<Defense[]>([])
  const [juryDefenses, setJuryDefenses] = useState<Defense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDefenses = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/professor-data`)
        if (!response.ok) throw new Error("Failed to fetch professor data")

        const data = await response.json()
        setSupervisedDefenses(data.supervisedDefenses || [])
        setJuryDefenses(data.juryDefenses || [])
      } catch (error) {
        toast.error("Impossible de charger vos soutenances")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDefenses()
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes soutenances</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes soutenances</CardTitle>
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
  )
}
