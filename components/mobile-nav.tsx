"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CalendarDays, Users, GraduationCap, DoorOpen, Calendar, Upload, Home, Menu, LogOut } from "lucide-react"
import { toast } from "sonner"

const navItems = [
  {
    title: "Accueil",
    href: "/",
    icon: Home,
  },
  {
    title: "Professeurs",
    href: "/professors",
    icon: Users,
  },
  {
    title: "Étudiants",
    href: "/students",
    icon: GraduationCap,
  },
  {
    title: "Projets",
    href: "/projects",
    icon: CalendarDays,
  },
  {
    title: "Salles",
    href: "/rooms",
    icon: DoorOpen,
  },
  {
    title: "Planification",
    href: "/schedule",
    icon: Calendar,
  },
  {
    title: "Importer",
    href: "/import",
    icon: Upload,
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  // Filter nav items based on user role
  let filteredNavItems = navItems
  if (session?.user?.role === "professor") {
    filteredNavItems = navItems.filter((item) =>
      ["/", "/dashboard", "/professor/profile", "/professor/availability", "/professor/defenses"].includes(item.href),
    )
  } else if (session?.user?.role === "student") {
    filteredNavItems = navItems.filter((item) =>
      ["/", "/dashboard", "/student/profile", "/student/project", "/student/defense"].includes(item.href),
    )
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut({ redirect: false })
      router.push("/login")
      setOpen(false)
      toast.success("Déconnexion réussie")
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
      toast.error("Erreur lors de la déconnexion")
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold text-xl">Planification</span>
          </Link>
        </div>
        <div className="flex flex-col gap-3 mt-8 px-7">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center py-2 text-base font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.title}
              </Link>
            )
          })}

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center py-2 text-base font-medium text-destructive hover:text-destructive/80 transition-colors mt-4"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {isSigningOut ? "Déconnexion..." : "Se déconnecter"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
