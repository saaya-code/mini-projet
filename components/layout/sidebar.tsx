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
      <div className="p-6 animate-fade-in">
        <Logo />
      </div>
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        {status === "loading" ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="animate-slide-in-bottom">
            <MainNav userRole={session?.user?.role} />
          </div>
        )}
      </div>
      <div className="p-4 border-t flex justify-between items-center animate-fade-in">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} UniDefense</p>
        <ModeToggle />
      </div>
    </div>
  )
}

