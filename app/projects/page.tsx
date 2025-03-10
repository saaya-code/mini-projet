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
import { ProjectForm } from "./project-form"

interface Project {
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState("list")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      setProjects(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Impossible de charger les projets")
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
    setActiveTab("edit")
  }

  const breadcrumbs = [{ label: "Projets", href: "/projects" }]

  return (
    <div>
      <Header breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Gestion des Projets" description="Gérez les projets de fin d'études">
          <Button onClick={() => setActiveTab("add")}>Ajouter un projet</Button>
        </PageHeader>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Liste des Projets</TabsTrigger>
            <TabsTrigger value="add">Ajouter un Projet</TabsTrigger>
            {selectedProject && <TabsTrigger value="edit">Modifier un Projet</TabsTrigger>}
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Projets</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    {searchTerm ? "Aucun projet ne correspond à votre recherche" : "Aucun projet n'a été ajouté"}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Étudiant</TableHead>
                        <TableHead>Superviseur</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project._id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.student.name}</TableCell>
                          <TableCell>{project.supervisor.name}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleSelectProject(project)}>
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
                <CardTitle>Ajouter un Projet</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectForm
                  onSuccess={() => {
                    fetchProjects()
                    setActiveTab("list")
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {selectedProject && (
            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle>Modifier un Projet</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectForm
                    project={selectedProject}
                    onSuccess={() => {
                      fetchProjects()
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

