"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface StudentFormProps {
  onSuccess: () => void
  student?: {
    _id: string
    name: string
    email: string
    studentId: string
    program: string
  }
}

export function StudentForm({ onSuccess, student }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    studentId: student?.studentId || "",
    program: student?.program || "",
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
      const url = student ? `/api/students/${student._id}` : "/api/students"
      const method = student ? "PUT" : "POST"

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

      toast.success(student ? "Étudiant mis à jour avec succès" : "Étudiant ajouté avec succès")

      if (!student) {
        setFormData({
          name: "",
          email: "",
          studentId: "",
          program: "",
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
        <Label htmlFor="studentId">Numéro d'étudiant</Label>
        <Input id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="program">Programme</Label>
        <Input id="program" name="program" value={formData.program} onChange={handleChange} required />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : student ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}
