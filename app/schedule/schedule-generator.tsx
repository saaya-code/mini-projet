"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Calendar, CalendarRange } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ScheduleGeneratorProps {
  date: Date | undefined
  dateRange: DateRange | undefined
  generationMode: "single" | "range"
  onGenerate: () => void
  isLoading: boolean
}

export function ScheduleGenerator({ date, dateRange, generationMode, onGenerate, isLoading }: ScheduleGeneratorProps) {
  if (generationMode === "single" && !date) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>Veuillez sélectionner une date pour générer le planning.</AlertDescription>
      </Alert>
    )
  }

  if (generationMode === "range" && (!dateRange?.from || !dateRange?.to)) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>Veuillez sélectionner une période complète pour générer le planning.</AlertDescription>
      </Alert>
    )
  }

  const formattedDate = date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : ""
  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "EEEE d MMMM yyyy", { locale: fr })} au ${format(dateRange.to, "EEEE d MMMM yyyy", { locale: fr })}`
      : ""

  return (
    <div className="space-y-6">
      <Alert className="bg-secondary border-primary/20">
        <div className="flex items-center gap-2">
          {generationMode === "single" ? (
            <Calendar className="h-4 w-4 text-primary" />
          ) : (
            <CalendarRange className="h-4 w-4 text-primary" />
          )}
          <AlertTitle>Génération automatique du planning</AlertTitle>
        </div>
        <AlertDescription>
          {generationMode === "single" ? (
            <>
              Le système va générer un planning pour le <span className="font-medium">{formattedDate}</span>
            </>
          ) : (
            <>
              Le système va générer un planning pour la période du{" "}
              <span className="font-medium">{formattedDateRange}</span>
            </>
          )}
          <span> en tenant compte des contraintes suivantes :</span>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Disponibilité des professeurs</li>
            <li>Disponibilité des salles</li>
            <li>Répartition équitable des rôles</li>
            <li>Un professeur ne peut pas être à la fois superviseur et membre du jury pour un même étudiant</li>
            {generationMode === "range" && <li>Répartition équilibrée des soutenances sur l'ensemble de la période</li>}
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button
          onClick={onGenerate}
          disabled={isLoading}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {isLoading ? "Génération en cours..." : "Générer le Planning"}
        </Button>
      </div>
    </div>
  )
}
