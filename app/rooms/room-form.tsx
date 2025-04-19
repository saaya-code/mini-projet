"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface RoomFormProps {
  onSuccess: () => void
  room?: {
    _id: string
    name: string
    capacity: number
    building: string
    floor: number
    isAvailable: boolean
  }
}

export function RoomForm({ onSuccess, room }: RoomFormProps) {
  const [formData, setFormData] = useState({
    name: room?.name || "",
    capacity: room?.capacity || 0,
    building: room?.building || "",
    floor: room?.floor || 0,
    isAvailable: room?.isAvailable ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isAvailable: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = room ? `/api/rooms/${room._id}` : "/api/rooms"
      const method = room ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission")
      }

      toast.success(room ? "Salle mise à jour avec succès" : "Salle ajoutée avec succès")

      if (!room) {
        setFormData({
          name: "",
          capacity: 0,
          building: "",
          floor: 0,
          isAvailable: true,
        })
      }

      onSuccess()
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="building">Bâtiment</Label>
        <Input id="building" name="building" value={formData.building} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="floor">Étage</Label>
          <Input id="floor" name="floor" type="number" value={formData.floor} onChange={handleChange} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="capacity">Capacité</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isAvailable" checked={formData.isAvailable} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="isAvailable">Disponible pour les soutenances</Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : room ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}
