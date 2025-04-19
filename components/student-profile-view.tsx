"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { GraduationCap, Mail, User, CalendarDays } from "lucide-react"

interface Student {
  _id: string
  name: string
  email: string
  studentId: string
  program: string
}

export function StudentProfileView({ userId }: { userId: string }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/student-data`)
        if (!response.ok) throw new Error("Failed to fetch student data")

        const data = await response.json()
        setStudent(data.student)
      } catch (error) {
        toast.error("Impossible de charger vos données")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!student) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Aucune donnée d'étudiant trouvée pour votre compte.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon profil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Nom</p>
              <p>{student.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Email</p>
              <p>{student.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Numéro d'étudiant</p>
              <p>{student.studentId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Programme</p>
              <p>{student.program}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
