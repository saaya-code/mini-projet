"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfessorForm } from "./professor-form"
import { AvailabilityForm } from "./availability-form"
import { toast } from "sonner"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { Search } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState("list")

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    try {
      const response = await fetch("/api/professors")
      const data = await response.json()
      setProfessors(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Impossible de charger les professeurs")
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
    setActiveTab("availability")
  }

  const breadcrumbs = [{ label: "Professeurs", href: "/professors" }]

  return (
    <div>
      <Header  breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Gestion des Professeurs" description="Gérez les professeurs et leurs disponibilités">
          <Button onClick={() => setActiveTab("add")}>Ajouter un professeur</Button>
        </PageHeader>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un professeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Liste des Professeurs</TabsTrigger>
            <TabsTrigger value="add">Ajouter un Professeur</TabsTrigger>
            {selectedProfessor && <TabsTrigger value="availability">Disponibilités</TabsTrigger>}
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Professeurs</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProfessors.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    {searchTerm
                      ? "Aucun professeur ne correspond à votre recherche"
                      : "Aucun professeur n'a été ajouté"}
                  </div>
                ) : (
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
                          <TableCell className="font-medium">{professor.name}</TableCell>
                          <TableCell>{professor.email}</TableCell>
                          <TableCell>{professor.department}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                              {professor.availability.length} créneaux
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleSelectProfessor(professor)}>
                              Gérer
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un Professeur</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfessorForm
                  onSuccess={() => {
                    fetchProfessors()
                    setActiveTab("list")
                  }}
                />
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
                  <AvailabilityForm
                    professor={selectedProfessor}
                    onSuccess={() => {
                      fetchProfessors()
                      setActiveTab("list")
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}

