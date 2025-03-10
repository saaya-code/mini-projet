"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { MainNav } from "./main-nav"
import { Logo } from "./logo"
import { ModeToggle } from "./mode-toggle"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="p-6 border-b">
          <Logo />
        </div>
        <div className="flex-1 px-4 py-4">
          <MainNav />
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Système de Planification</p>
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}

