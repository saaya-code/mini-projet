"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { toast } from "sonner"

interface TimeSlot {
  day: string
  startTime: string
  endTime: string
}

interface Professor {
  _id: string
  name: string
  availability: TimeSlot[]
}

interface AvailabilityFormProps {
  professor: Professor
  onSuccess: () => void
}

export function AvailabilityForm({ professor, onSuccess }: AvailabilityFormProps) {
  const [availability, setAvailability] = useState<TimeSlot[]>(professor.availability || [])
  const [newSlot, setNewSlot] = useState<TimeSlot>({
    day: "",
    startTime: "",
    endTime: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]

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
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/professors/${professor._id}/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ availability }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des disponibilités")
      }

      toast.success("Disponibilités mises à jour avec succès")

      onSuccess()
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
  )
}
