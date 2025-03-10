"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { Search } from "lucide-react"
import { StudentForm } from "./student-form"

interface Student {
  _id: string
  name: string
  email: string
  studentId: string
  program: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [activeTab, setActiveTab] = useState("list")

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      setStudents(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Impossible de charger les étudiants")
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student)
    setActiveTab("edit")
  }

  const breadcrumbs = [{ label: "Étudiants", href: "/students" }]

  return (
    <div>
      <Header breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Gestion des Étudiants" description="Gérez les informations des étudiants">
          <Button onClick={() => setActiveTab("add")}>Ajouter un étudiant</Button>
        </PageHeader>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Liste des Étudiants</TabsTrigger>
            <TabsTrigger value="add">Ajouter un Étudiant</TabsTrigger>
            {selectedStudent && <TabsTrigger value="edit">Modifier un Étudiant</TabsTrigger>}
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Étudiants</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    {searchTerm ? "Aucun étudiant ne correspond à votre recherche" : "Aucun étudiant n'a été ajouté"}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Numéro d&apos;étudiant</TableHead>
                        <TableHead>Programme</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.program}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleSelectStudent(student)}>
                              Modifier
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
                <CardTitle>Ajouter un Étudiant</CardTitle>
              </CardHeader>
              <CardContent>
                <StudentForm
                  onSuccess={() => {
                    fetchStudents()
                    setActiveTab("list")
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {selectedStudent && (
            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle>Modifier un Étudiant</CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentForm
                    student={selectedStudent}
                    onSuccess={() => {
                      fetchStudents()
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

