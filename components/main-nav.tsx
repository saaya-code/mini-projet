"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  CalendarDays,
  Users,
  GraduationCap,
  DoorOpen,
  Calendar,
  Upload,
  Database,
  LayoutDashboard,
  User,
  Clock,
  FileText,
} from "lucide-react"

type UserRole = "admin" | "professor" | "student" | undefined

export function MainNav({ userRole }: { userRole?: UserRole }) {
  const pathname = usePathname()

  // Admin routes - full access to everything
  const adminRoutes = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/professors",
      label: "Professeurs",
      icon: Users,
      active: pathname.startsWith("/professors"),
    },
    {
      href: "/students",
      label: "Étudiants",
      icon: GraduationCap,
      active: pathname.startsWith("/students"),
    },
    {
      href: "/projects",
      label: "Projets",
      icon: FileText,
      active: pathname.startsWith("/projects"),
    },
    {
      href: "/rooms",
      label: "Salles",
      icon: DoorOpen,
      active: pathname.startsWith("/rooms"),
    },
    {
      href: "/schedule",
      label: "Planification",
      icon: Calendar,
      active: pathname.startsWith("/schedule"),
    },
    {
      href: "/import",
      label: "Importer",
      icon: Upload,
      active: pathname.startsWith("/import"),
    },
    {
      href: "/seed",
      label: "Initialiser DB",
      icon: Database,
      active: pathname.startsWith("/seed"),
    },
  ]

  // Professor routes - only their own data and availability
  const professorRoutes = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/professor/profile",
      label: "Mon profil",
      icon: User,
      active: pathname.startsWith("/professor/profile"),
    },
    {
      href: "/professor/availability",
      label: "Mes disponibilités",
      icon: Clock,
      active: pathname.startsWith("/professor/availability"),
    },
    {
      href: "/professor/defenses",
      label: "Mes soutenances",
      icon: CalendarDays,
      active: pathname.startsWith("/professor/defenses"),
    },
  ]

  // Student routes - only their own project and defense
  const studentRoutes = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/student/profile",
      label: "Mon profil",
      icon: User,
      active: pathname.startsWith("/student/profile"),
    },
    {
      href: "/student/project",
      label: "Mon projet",
      icon: FileText,
      active: pathname.startsWith("/student/project"),
    },
    {
      href: "/student/defense",
      label: "Ma soutenance",
      icon: Calendar,
      active: pathname.startsWith("/student/defense"),
    },
  ]

  // Select routes based on user role
  let routes = adminRoutes
  if (userRole === "professor") {
    routes = professorRoutes
  } else if (userRole === "student") {
    routes = studentRoutes
  }

  return (
    <nav className="flex flex-col gap-2 w-full">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
            route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
