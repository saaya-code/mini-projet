import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, GraduationCap, DoorOpen, Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Système de Planification des Soutenances</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Professeurs</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Gérer les professeurs et leurs disponibilités</CardDescription>
            <Link href="/professors">
              <Button className="w-full">Gérer les professeurs</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Étudiants</CardTitle>
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Gérer les étudiants et leurs projets</CardDescription>
            <Link href="/students">
              <Button className="w-full">Gérer les étudiants</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Projets</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Gérer les projets de fin d&apos;études</CardDescription>
            <Link href="/projects">
              <Button className="w-full">Gérer les projets</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Salles</CardTitle>
            <DoorOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Gérer les salles disponibles</CardDescription>
            <Link href="/rooms">
              <Button className="w-full">Gérer les salles</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Planification</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Générer et visualiser le planning des soutenances</CardDescription>
            <Link href="/schedule">
              <Button className="w-full">Planifier les soutenances</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

