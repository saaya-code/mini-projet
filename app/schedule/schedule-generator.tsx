"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface ScheduleGeneratorProps {
  date: Date | undefined
  onGenerate: () => void
  isLoading: boolean
}

export function ScheduleGenerator({ date, onGenerate, isLoading }: ScheduleGeneratorProps) {
  if (!date) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>Veuillez sélectionner une date pour générer le planning.</AlertDescription>
      </Alert>
    )
  }

  const formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Génération automatique du planning</AlertTitle>
        <AlertDescription>
          Le système va générer un planning pour le {formattedDate} en tenant compte des contraintes suivantes :
          <ul className="list-disc pl-5 mt-2">
            <li>Disponibilité des professeurs</li>
            <li>Disponibilité des salles</li>
            <li>Répartition équitable des rôles</li>
            <li>Un professeur ne peut pas être à la fois superviseur et membre du jury pour un même étudiant</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button onClick={onGenerate} disabled={isLoading} size="lg">
          {isLoading ? "Génération en cours..." : "Générer le Planning"}
        </Button>
      </div>
    </div>
  )
}

