"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, GraduationCap, DoorOpen, Calendar, Upload, Database, BarChart } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cards = [
    {
      title: "Professeurs",
      description: "Gérer les professeurs et leurs disponibilités",
      icon: Users,
      href: "/professors",
      color: "bg-blue-50 dark:bg-blue-950",
      iconColor: "text-blue-500",
    },
    {
      title: "Étudiants",
      description: "Gérer les étudiants et leurs projets",
      icon: GraduationCap,
      href: "/students",
      color: "bg-green-50 dark:bg-green-950",
      iconColor: "text-green-500",
    },
    {
      title: "Projets",
      description: "Gérer les projets de fin d'études",
      icon: CalendarDays,
      href: "/projects",
      color: "bg-purple-50 dark:bg-purple-950",
      iconColor: "text-purple-500",
    },
    {
      title: "Salles",
      description: "Gérer les salles disponibles",
      icon: DoorOpen,
      href: "/rooms",
      color: "bg-orange-50 dark:bg-orange-950",
      iconColor: "text-orange-500",
    },
    {
      title: "Planification",
      description: "Générer et visualiser le planning des soutenances",
      icon: Calendar,
      href: "/schedule",
      color: "bg-red-50 dark:bg-red-950",
      iconColor: "text-red-500",
    },
    {
      title: "Importer des données",
      description: "Importer des données depuis Excel ou CSV",
      icon: Upload,
      href: "/import",
      color: "bg-teal-50 dark:bg-teal-950",
      iconColor: "text-teal-500",
    },
    {
      title: "Statistiques",
      description: "Visualiser les statistiques du système",
      icon: BarChart,
      href: "/stats",
      color: "bg-indigo-50 dark:bg-indigo-950",
      iconColor: "text-indigo-500",
    },
    {
      title: "Initialiser la base de données",
      description: "Créer des données de test pour le système",
      icon: Database,
      href: "/seed",
      color: "bg-gray-50 dark:bg-gray-900",
      iconColor: "text-gray-500",
    },
  ]

  return (
    <div className="space-y-8 page-transition-in">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-university-50 dark:bg-university-900/20 border-university-100 dark:border-university-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Professeurs</p>
                <h3 className="text-2xl font-bold mt-1">15</h3>
              </div>
              <div className="h-12 w-12 bg-university-100 dark:bg-university-800/30 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-university-700 dark:text-university-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-university-50 dark:bg-university-900/20 border-university-100 dark:border-university-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Étudiants</p>
                <h3 className="text-2xl font-bold mt-1">24</h3>
              </div>
              <div className="h-12 w-12 bg-university-100 dark:bg-university-800/30 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-university-700 dark:text-university-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-university-50 dark:bg-university-900/20 border-university-100 dark:border-university-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projets</p>
                <h3 className="text-2xl font-bold mt-1">20</h3>
              </div>
              <div className="h-12 w-12 bg-university-100 dark:bg-university-800/30 rounded-full flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-university-700 dark:text-university-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-university-50 dark:bg-university-900/20 border-university-100 dark:border-university-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Soutenances Planifiées</p>
                <h3 className="text-2xl font-bold mt-1">18</h3>
              </div>
              <div className="h-12 w-12 bg-university-100 dark:bg-university-800/30 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-university-700 dark:text-university-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mounted &&
          cards.map((card) => (
            <Card key={card.title} className={`card-hover border overflow-hidden ${card.color}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium">{card.title}</CardTitle>
                  <div
                    className={`h-10 w-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm ${card.iconColor}`}
                  >
                    <card.icon className="h-5 w-5" />
                  </div>
                </div>
                <CardDescription className="mt-2">{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={card.href} className="block mt-2">
                  <Button className="w-full bg-university-700 hover:bg-university-800 transition-all duration-300">
                    Accéder
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Les dernières actions effectuées dans le système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 animate-slide-in-bottom"
              style={{ animationDelay: "0ms" }}
            >
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouvel étudiant ajouté</p>
                <p className="text-xs text-muted-foreground">Alice Caron a été ajoutée au système</p>
              </div>
              <div className="text-xs text-muted-foreground">Il y a 2 heures</div>
            </div>
            <div
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 animate-slide-in-bottom"
              style={{ animationDelay: "100ms" }}
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Planning généré</p>
                <p className="text-xs text-muted-foreground">18 soutenances ont été planifiées</p>
              </div>
              <div className="text-xs text-muted-foreground">Il y a 5 heures</div>
            </div>
            <div
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 animate-slide-in-bottom"
              style={{ animationDelay: "200ms" }}
            >
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau projet créé</p>
                <p className="text-xs text-muted-foreground">Projet "Système de reconnaissance faciale" ajouté</p>
              </div>
              <div className="text-xs text-muted-foreground">Il y a 1 jour</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
