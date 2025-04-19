"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface TimeSlot {
  day: string
  startTime: string
  endTime: string
}

interface ProfessorData {
  _id: string
  name: string
  availability: TimeSlot[]
}

export function ProfessorAvailabilityForm({ userId }: { userId: string }) {
  const [professor, setProfessor] = useState<ProfessorData | null>(null)
  const [availability, setAvailability] = useState<TimeSlot[]>([])
  const [newSlot, setNewSlot] = useState<TimeSlot>({
    day: "",
    startTime: "",
    endTime: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/professor-data`)
        if (!response.ok) throw new Error("Failed to fetch professor data")

        const data = await response.json()
        setProfessor(data.professor)
        setAvailability(data.professor.availability || [])
      } catch (error) {
        toast.error("Impossible de charger vos données")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfessorData()
  }, [userId])

  const handleAddSlot = () => {
    if (!newSlot.day || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    if (newSlot.startTime >= newSlot.endTime) {
      toast.error("L'heure de début doit être antérieure à l'heure de fin")
      return
    }

    setAvailability([...availability, { ...newSlot }])
    setNewSlot({
      day: "",
      startTime: "",
      endTime: "",
    })
  }

  const handleRemoveSlot = (index: number) => {
    const updatedSlots = [...availability]
    updatedSlots.splice(index, 1)
    setAvailability(updatedSlots)
  }

  const handleSubmit = async () => {
    if (!professor) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/professors/${professor._id}/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ availability }),
      })

      if (!response.ok) throw new Error("Failed to update availability")

      toast.success("Disponibilités mises à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des disponibilités")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes disponibilités</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-1/4" />
        </CardContent>
      </Card>
    )
  }

  if (!professor) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Aucune donnée de professeur trouvée pour votre compte.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes disponibilités</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="day">Jour</Label>
                <Select value={newSlot.day} onValueChange={(value) => setNewSlot({ ...newSlot, day: value })}>
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Sélectionner un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                />
              </div>
            </div>

            <Button type="button" onClick={handleAddSlot}>
              Ajouter un créneau
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Créneaux disponibles</h3>
            {availability.length === 0 ? (
              <p className="text-muted-foreground">Aucun créneau disponible</p>
            ) : (
              <div className="grid gap-2">
                {availability.map((slot, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{slot.day}</p>
                        <p className="text-sm text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveSlot(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les disponibilités"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
