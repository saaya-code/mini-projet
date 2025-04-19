"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface ProfessorData {
  _id: string
  name: string
  email: string
  department: string
}

export function ProfessorProfileForm({ userId }: { userId: string }) {
  const [professor, setProfessor] = useState<ProfessorData | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/professor-data`)
        if (!response.ok) throw new Error("Failed to fetch professor data")

        const data = await response.json()
        setProfessor(data.professor)
        setFormData({
          name: data.professor.name,
          email: data.professor.email,
          department: data.professor.department,
        })
      } catch (error) {
        toast.error("Impossible de charger vos données")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfessorData()
  }, [userId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!professor) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/professors/${professor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      toast.success("Profil mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
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
        <CardTitle>Mon profil</CardTitle>
      </CardHeader>
      <CardContent>
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
            {isSubmitting ? "Enregistrement..." : "Mettre à jour"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
