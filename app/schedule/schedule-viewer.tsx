"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Users, GraduationCap, DoorOpen } from "lucide-react"

interface Defense {
  _id: string
  date: string
  startTime: string
  endTime: string
  room: {
    _id: string
    name: string
  }
  project: {
    _id: string
    title: string
    student: {
      _id: string
      name: string
    }
    supervisor: {
      _id: string
      name: string
    }
  }
  juryPresident: {
    _id: string
    name: string
  }
  juryReporter: {
    _id: string
    name: string
  }
}

interface ScheduleViewerProps {
  date: Date | undefined
  defenses: Defense[]
  isLoading: boolean
}

export function ScheduleViewer({ date, defenses, isLoading }: ScheduleViewerProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!date) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Veuillez sélectionner une date pour voir le planning.</AlertDescription>
      </Alert>
    )
  }

  if (defenses.length === 0) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Aucune soutenance n&apos;est planifiée pour cette date.</AlertDescription>
      </Alert>
    )
  }

  // Sort defenses by start time
  const sortedDefenses = [...defenses].sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="space-y-4">
      {sortedDefenses.map((defense) => (
        <Card key={defense._id} className="overflow-hidden">
          <div className="bg-primary h-2" />
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{defense.project.title}</h3>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {defense.startTime} - {defense.endTime}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Étudiant:</span> {defense.project.student.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Salle:</span> {defense.room.name}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" /> Jury
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Superviseur:</span> {defense.project.supervisor.name}
                  </div>
                  <div>
                    <span className="font-medium">Président:</span> {defense.juryPresident.name}
                  </div>
                  <div>
                    <span className="font-medium">Rapporteur:</span> {defense.juryReporter.name}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
