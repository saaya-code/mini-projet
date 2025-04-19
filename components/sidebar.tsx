"use client"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { MainNav } from "@/components/layout/main-nav"
import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function Sidebar() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter nav items based on user role
  const userRole = session?.user?.role
  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut({ redirect: false })
      router.push("/login")
      toast.success("Déconnexion réussie")
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
      toast.error("Erreur lors de la déconnexion")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="hidden md:block fixed top-0 left-0 h-full w-64 border-r bg-background z-50">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Logo />
          <ModeToggle />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <MainNav userRole={userRole} />
        </div>
        <div className="p-6 border-t">
          <Button variant="outline" className="w-full" onClick={handleSignOut} disabled={isSigningOut}>
            {isSigningOut ? "Déconnexion..." : "Se déconnecter"}
          </Button>
        </div>
      </div>
    </div>
  )
}
