"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfessorForm } from "./professor-form"
import { AvailabilityForm } from "./availability-form"

interface Professor {
  _id: string
  name: string
  email: string
  department: string
  availability: {
    day: string
    startTime: string
    endTime: string
  }[]
}

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    try {
      const response = await fetch("/api/professors")
      const data = await response.json()
      setProfessors(data)
    } catch (error) {
      console.error(error)
    }
  }

  const filteredProfessors = professors.filter(
    (professor) =>
      professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectProfessor = (professor: Professor) => {
    setSelectedProfessor(professor)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gestion des Professeurs</h1>

      <div className="mb-6">
        <Input
          placeholder="Rechercher un professeur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Liste des Professeurs</TabsTrigger>
          <TabsTrigger value="add">Ajouter un Professeur</TabsTrigger>
          {selectedProfessor && <TabsTrigger value="availability">Gérer les Disponibilités</TabsTrigger>}
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Professeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Disponibilités</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessors.map((professor) => (
                    <TableRow key={professor._id}>
                      <TableCell>{professor.name}</TableCell>
                      <TableCell>{professor.email}</TableCell>
                      <TableCell>{professor.department}</TableCell>
                      <TableCell>{professor.availability.length} créneaux</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleSelectProfessor(professor)}>
                          Gérer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un Professeur</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfessorForm onSuccess={fetchProfessors} />
            </CardContent>
          </Card>
        </TabsContent>

        {selectedProfessor && (
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Disponibilités de {selectedProfessor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <AvailabilityForm professor={selectedProfessor} onSuccess={fetchProfessors} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

