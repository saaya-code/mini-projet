"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "./file-uploader"
import { toast } from "sonner"
import { Download } from "lucide-react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState("professors")
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (file: File, type: string) => {
    if (!file) return

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "text/csv", // csv
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format de fichier non supporté. Veuillez utiliser Excel (.xlsx, .xls) ou CSV.")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`/api/import/${type}`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'importation")
      }

      toast.success(`${data.count} ${type} importés avec succès`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue lors de l'importation")
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = (type: string) => {
    window.location.href = `/api/templates/${type}`
  }

  const breadcrumbs = [{ label: "Importer des données", href: "/import" }]

  return (
    <div>
      <Header breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Importer des données" description="Importez des données depuis des fichiers Excel ou CSV" />

        <Card>
          <CardHeader>
            <CardTitle>Importation de données</CardTitle>
            <CardDescription>Importez des données depuis des fichiers Excel (.xlsx, .xls) ou CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="professors">Professeurs</TabsTrigger>
                <TabsTrigger value="students">Étudiants</TabsTrigger>
                <TabsTrigger value="projects">Projets</TabsTrigger>
                <TabsTrigger value="rooms">Salles</TabsTrigger>
              </TabsList>

              <TabsContent value="professors">
                <div className="space-y-4">
                  <div className="rounded-md border p-4 bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Format attendu</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTemplate("professors")}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger le modèle
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Le fichier doit contenir les colonnes suivantes :
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>name (Nom du professeur)</li>
                      <li>email (Email du professeur)</li>
                      <li>department (Département)</li>
                    </ul>
                  </div>

                  <FileUploader onUpload={(file) => handleUpload(file, "professors")} isUploading={isUploading} />
                </div>
              </TabsContent>

              <TabsContent value="students">
                <div className="space-y-4">
                  <div className="rounded-md border p-4 bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Format attendu</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTemplate("students")}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger le modèle
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Le fichier doit contenir les colonnes suivantes :
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>name (Nom de l&apos;étudiant)</li>
                      <li>email (Email de l&apos;étudiant)</li>
                      <li>studentId (Numéro d&apos;étudiant)</li>
                      <li>program (Programme d&apos;études)</li>
                    </ul>
                  </div>

                  <FileUploader onUpload={(file) => handleUpload(file, "students")} isUploading={isUploading} />
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="space-y-4">
                  <div className="rounded-md border p-4 bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Format attendu</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTemplate("projects")}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger le modèle
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Le fichier doit contenir les colonnes suivantes :
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>title (Titre du projet)</li>
                      <li>description (Description du projet)</li>
                      <li>studentEmail (Email de l&apos;étudiant)</li>
                      <li>supervisorEmail (Email du superviseur)</li>
                    </ul>
                  </div>

                  <FileUploader onUpload={(file) => handleUpload(file, "projects")} isUploading={isUploading} />
                </div>
              </TabsContent>

              <TabsContent value="rooms">
                <div className="space-y-4">
                  <div className="rounded-md border p-4 bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Format attendu</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTemplate("rooms")}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger le modèle
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Le fichier doit contenir les colonnes suivantes :
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>name (Nom de la salle)</li>
                      <li>capacity (Capacité)</li>
                      <li>building (Bâtiment)</li>
                      <li>floor (Étage)</li>
                      <li>isAvailable (Disponibilité, &quot;true&quot; ou &quot;false&quot;)</li>
                    </ul>
                  </div>

                  <FileUploader onUpload={(file) => handleUpload(file, "rooms")} isUploading={isUploading} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
