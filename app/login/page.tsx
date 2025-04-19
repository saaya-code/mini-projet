"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, GraduationCap, BookOpen, Users, Calendar } from "lucide-react"
import { Logo } from "@/components/layout/logo"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Identifiants invalides. Veuillez réessayer.")
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>Connectez-vous pour accéder à votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-university-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-university-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-university-700 hover:bg-university-800 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">Système de planification des soutenances de fin d'études</p>
          </CardFooter>
        </Card>
      </div>

      {/* Right side - Hero section */}
      <div className="flex-1 bg-university-800 text-white p-8 hidden md:flex md:flex-col md:justify-center gradient-animation">
        <div className="max-w-md mx-auto space-y-8 animate-slide-in-bottom">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-12 w-12" />
            <h1 className="text-3xl font-bold">UniDefense</h1>
          </div>
          <h2 className="text-2xl font-semibold">Planification des soutenances simplifiée</h2>
          <p className="text-lg opacity-90">
            Une plateforme complète pour organiser, planifier et gérer les soutenances de fin d'études.
          </p>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Calendar className="h-5 w-5" />
              </div>
              <p>Planification automatique des soutenances</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Users className="h-5 w-5" />
              </div>
              <p>Gestion des professeurs et des jurys</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <BookOpen className="h-5 w-5" />
              </div>
              <p>Suivi des projets de fin d'études</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
