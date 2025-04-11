"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, GraduationCap, DoorOpen, Calendar, Upload, Database } from "lucide-react"

export default function AdminDashboard() {
  const cards = [
    {
      title: "Professeurs",
      description: "Gérer les professeurs et leurs disponibilités",
      icon: Users,
      href: "/professors",
    },
    {
      title: "Étudiants",
      description: "Gérer les étudiants et leurs projets",
      icon: GraduationCap,
      href: "/students",
    },
    {
      title: "Projets",
      description: "Gérer les projets de fin d'études",
      icon: CalendarDays,
      href: "/projects",
    },
    {
      title: "Salles",
      description: "Gérer les salles disponibles",
      icon: DoorOpen,
      href: "/rooms",
    },
    {
      title: "Planification",
      description: "Générer et visualiser le planning des soutenances",
      icon: Calendar,
      href: "/schedule",
    },
    {
      title: "Importer des données",
      description: "Importer des données depuis Excel ou CSV",
      icon: Upload,
      href: "/import",
    },
    {
      title: "Initialiser la base de données",
      description: "Créer des données de test pour le système",
      icon: Database,
      href: "/seed",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">{card.title}</CardTitle>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <card.icon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">{card.description}</CardDescription>
            <Link href={card.href}>
              <Button className="w-full">Accéder</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
