"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CalendarDays, Users, GraduationCap, DoorOpen, Calendar, Upload, Home, Database } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Tableau de bord",
      icon: Home,
      active: pathname === "/",
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
      icon: CalendarDays,
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

