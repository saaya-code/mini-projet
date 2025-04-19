"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, GraduationCap, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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

interface TimeSlot {
  start: string
  end: string
}

export default function TimetablePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [defenses, setDefenses] = useState<Defense[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [rooms, setRooms] = useState<{ _id: string; name: string }[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    if (selectedDate) {
      fetchDefenses(selectedDate)
    }
  }, [selectedDate])

  const fetchDefenses = async (date: Date) => {
    setIsLoading(true)
    try {
      const formattedDate = date.toISOString().split("T")[0]
      const response = await fetch(`/api/defenses?date=${formattedDate}`)
      const data = await response.json()
      setDefenses(data)

      // Extract unique rooms and time slots
      const uniqueRooms = Array.from(
        new Set(data.map((defense: Defense) => JSON.stringify({ _id: defense.room._id, name: defense.room.name }))),
      ).map((room) => JSON.parse(room))

      const uniqueTimeSlots = Array.from(
        new Set(data.map((defense: Defense) => JSON.stringify({ start: defense.startTime, end: defense.endTime }))),
      ).map((slot) => JSON.parse(slot))

      // Sort time slots chronologically
      uniqueTimeSlots.sort((a, b) => a.start.localeCompare(b.start))

      setRooms(uniqueRooms)
      setTimeSlots(uniqueTimeSlots)
    } catch (error) {
      toast.error("Impossible de charger les soutenances")
    } finally {
      setIsLoading(false)
    }
  }

  const getDefenseForRoomAndTimeSlot = (roomId: string, timeSlot: TimeSlot) => {
    return defenses.find(
      (defense) =>
        defense.room._id === roomId && defense.startTime === timeSlot.start && defense.endTime === timeSlot.end,
    )
  }

  const formatDateHeader = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "EEEE d MMMM yyyy", { locale: fr }).replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
  }

  const breadcrumbs = [
    { label: "Planification", href: "/schedule" },
    { label: "Emploi du temps", href: "/schedule/timetable" },
  ]

  return (
    <div>
      <Header title="Emploi du temps" breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader
          title="Emploi du temps des Soutenances"
          description="Visualisez les soutenances par salle et créneau horaire"
        >
          <Link href="/schedule">
            <Button variant="outline">Retour à la planification</Button>
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Sélectionner une date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{selectedDate ? formatDateHeader(selectedDate) : "Sélectionnez une date"}</span>
                  </div>
                </CardTitle>
                <Badge variant={defenses.length > 0 ? "success" : "secondary"}>{defenses.length} soutenances</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : defenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune soutenance n'est planifiée pour cette date.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-muted font-medium text-left min-w-[100px]">Horaire</th>
                        {rooms.map((room) => (
                          <th key={room._id} className="border p-2 bg-muted font-medium text-center min-w-[200px]">
                            {room.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((timeSlot) => (
                        <tr key={`${timeSlot.start}-${timeSlot.end}`}>
                          <td className="border p-2 font-medium">
                            {timeSlot.start} - {timeSlot.end}
                          </td>
                          {rooms.map((room) => {
                            const defense = getDefenseForRoomAndTimeSlot(room._id, timeSlot)
                            return (
                              <td key={`${room._id}-${timeSlot.start}`} className="border p-0">
                                {defense ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="p-2 h-full bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                                          <div className="font-medium text-sm truncate">{defense.project.title}</div>
                                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                            <GraduationCap className="h-3 w-3" />
                                            <span className="truncate">{defense.project.student.name}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                            <Users className="h-3 w-3" />
                                            <span className="truncate">
                                              {defense.juryPresident.name.split(" ")[1]},{" "}
                                              {defense.juryReporter.name.split(" ")[1]}
                                            </span>
                                          </div>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="bottom" className="max-w-sm">
                                        <div className="space-y-2">
                                          <p className="font-bold">{defense.project.title}</p>
                                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                            <span className="font-medium">Étudiant:</span>
                                            <span>{defense.project.student.name}</span>

                                            <span className="font-medium">Superviseur:</span>
                                            <span>{defense.project.supervisor.name}</span>

                                            <span className="font-medium">Président du jury:</span>
                                            <span>{defense.juryPresident.name}</span>

                                            <span className="font-medium">Rapporteur:</span>
                                            <span>{defense.juryReporter.name}</span>
                                          </div>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <div className="p-2 h-full text-center text-muted-foreground text-sm">-</div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
