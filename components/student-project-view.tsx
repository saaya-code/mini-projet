"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { FileText, User, Mail } from "lucide-react"
import Link from "next/link"

interface Project {
  _id: string
  title: string
  description: string
  supervisor: {
    name: string
    email: string
  }
}

export function StudentProjectView({ userId }: { userId: string }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/student-data`)
        if (!response.ok) throw new Error("Failed to fetch student data")

        const data = await response.json()
        setProject(data.project)
      } catch (error) {
        toast.error("Impossible de charger les données du projet")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectData()
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mon projet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-40" />
        </CardContent>
      </Card>
    )
  }

  if (!project) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Aucun projet assigné</h3>
          <p className="text-muted-foreground mb-4">Vous n'avez pas encore de projet de fin d'études assigné.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon projet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">{project.title}</h2>
          <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Superviseur</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{project.supervisor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{project.supervisor.email}</span>
              </div>
              <div className="mt-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`mailto:${project.supervisor.email}`}>Contacter le superviseur</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
