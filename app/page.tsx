import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, GraduationCap, DoorOpen, Calendar, Upload } from "lucide-react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"

export default function Home() {
  return (
    <div>
      <Header  />
      <div className="container py-10">
        <PageHeader title="Tableau de bord" description="Gérez les soutenances de fin d'études" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Professeurs</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Gérer les professeurs et leurs disponibilités</CardDescription>
              <Link href="/professors">
                <Button className="w-full">Gérer les professeurs</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Étudiants</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Gérer les étudiants et leurs projets</CardDescription>
              <Link href="/students">
                <Button className="w-full">Gérer les étudiants</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Projets</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Gérer les projets de fin d&apos;études</CardDescription>
              <Link href="/projects">
                <Button className="w-full">Gérer les projets</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Salles</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DoorOpen className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Gérer les salles disponibles</CardDescription>
              <Link href="/rooms">
                <Button className="w-full">Gérer les salles</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Planification</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Générer et visualiser le planning des soutenances</CardDescription>
              <Link href="/schedule">
                <Button className="w-full">Planifier les soutenances</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Importer des données</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Importer des données depuis Excel ou CSV</CardDescription>
              <Link href="/import">
                <Button className="w-full">Importer des données</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

