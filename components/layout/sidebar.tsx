import { MainNav } from "./main-nav"
import { Logo } from "./logo"
import { ModeToggle } from "./mode-toggle"

export function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-background hidden md:flex flex-col">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex-1 px-4 py-2">
        <MainNav />
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Système de Planification</p>
        <ModeToggle />
      </div>
    </div>
  )
}

