"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ProfessorFormProps {
  onSuccess: () => void
  professor?: {
    _id: string
    name: string
    email: string
    department: string
  }
}

export function ProfessorForm({ onSuccess, professor }: ProfessorFormProps) {
  const [formData, setFormData] = useState({
    name: professor?.name || "",
    email: professor?.email || "",
    department: professor?.department || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = professor ? `/api/professors/${professor._id}` : "/api/professors"
      const method = professor ? "PUT" : "POST"

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

      toast.success(professor ? "Professeur mis à jour avec succès" : "Professeur ajouté avec succès")

      if (!professor) {
        setFormData({
          name: "",
          email: "",
          department: "",
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
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="department">Département</Label>
        <Input id="department" name="department" value={formData.department} onChange={handleChange} required />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : professor ? "Mettre à jour" : "Ajouter"}
      </Button>
    </form>
  )
}
