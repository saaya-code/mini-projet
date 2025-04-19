"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Student {
  _id: string
  name: string
}

interface Professor {
  _id: string
  name: string
}

interface ProjectFormProps {
  onSuccess: () => void
  project?: {
    _id: string
    title: string
    description: string
    student: {
      _id: string
      name: string
    }
    supervisor: {
      _id: string
      name: string
    }
  }
}

export function ProjectForm({ onSuccess, project }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    student: project?.student._id || "",
    supervisor: project?.supervisor._id || "",
  })
  const [students, setStudents] = useState<Student[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [studentsRes, professorsRes] = await Promise.all([fetch("/api/students"), fetch("/api/professors")])

        const studentsData = await studentsRes.json()
        const professorsData = await professorsRes.json()

        setStudents(studentsData)
        setProfessors(professorsData)
      } catch (error) {
        toast.error("Erreur lors du chargement des données")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = project ? `/api/projects/${project._id}` : "/api/projects"
      const method = project ? "PUT" : "POST"

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

      toast.success(project ? "Projet mis à jour avec succès" : "Projet ajouté avec succès")

      if (!project) {
        setFormData({
          title: "",
          description: "",
          student: "",
          supervisor: "",
        })
      }

      onSuccess()
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Chargement des données...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="student">Étudiant</Label>
        <Select value={formData.student} onValueChange={(value) => handleSelectChange("student", value)} required>
          <SelectTrigger id="student">
            <SelectValue placeholder="Sélectionner un étudiant" />
          </SelectTrigger>
          <SelectContent>
            {students.length === 0 ? (
              <SelectItem value="none" disabled>
                Aucun étudiant disponible
              </SelectItem>
            ) : (
              students.map((student) => (
                <SelectItem key={student._id} value={student._id}>
                  {student.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="supervisor">Superviseur</Label>
        <Select value={formData.supervisor} onValueChange={(value) => handleSelectChange("supervisor", value)} required>
          <SelectTrigger id="supervisor">
            <SelectValue placeholder="Sélectionner un superviseur" />
          </SelectTrigger>
          <SelectContent>
            {professors.length === 0 ? (
              <SelectItem value="none" disabled>
                Aucun professeur disponible
              </SelectItem>
            ) : (
              professors.map((professor) => (
                <SelectItem key={professor._id} value={professor._id}>
                  {professor.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : project ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}
