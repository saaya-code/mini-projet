"use client"

import { useSession } from "next-auth/react"
import { MainNav } from "./main-nav"
import { Logo } from "./logo"
import { ModeToggle } from "./mode-toggle"
import { Skeleton } from "@/components/ui/skeleton"

export function Sidebar() {
  const { data: session, status } = useSession()

  return (
    <div className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-background hidden md:flex flex-col">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex-1 px-4 py-2">
        {status === "loading" ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <MainNav userRole={session?.user?.role} />
        )}
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Système de Planification</p>
        <ModeToggle />
      </div>
    </div>
  )
}
