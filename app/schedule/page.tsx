"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { ScheduleGenerator } from "./schedule-generator"
import { ScheduleViewer } from "./schedule-viewer"
import { toast } from "sonner"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { TableIcon } from "lucide-react"
import Link from "next/link"
import type { DateRange } from "react-day-picker"
import { format, addDays } from "date-fns"
import { fr } from "date-fns/locale"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  })
  const [tab, setTab] = useState("view")
  const [generationMode, setGenerationMode] = useState<"single" | "range">("single")

  const [defenses, setDefenses] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      fetchDefenses(selectedDate)
    }
  }, [selectedDate])

  const fetchDefenses = async (date: Date) => {
    setIsLoading(true)
    try {
      const formattedDate = date.toISOString().split("T")[0]
      const response = await fetch(`/api/defenses?date=${formattedDate}`)
      const data = await response.json()
      setDefenses(data)
    } catch (error) {
      toast.error("Impossible de charger les soutenances")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSchedule = async () => {
    setIsLoading(true)
    try {
      const endpoint = "/api/schedule/generate"
      const body =
        generationMode === "single"
          ? { date: selectedDate }
          : { dateRange: { from: dateRange?.from, to: dateRange?.to } }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du planning")
      }

      const data = await response.json()

      toast.success(
        generationMode === "single"
          ? "Planning généré avec succès"
          : `Planning généré avec succès pour ${data.totalDays} jours`,
      )

      if (selectedDate) {
        fetchDefenses(selectedDate)
      }
      setTab("view")
    } catch (error) {
      toast.error("Une erreur est survenue lors de la génération du planning")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateRange = (range?: DateRange) => {
    if (!range?.from) return ""
    if (!range.to) return format(range.from, "PPP", { locale: fr })
    return `${format(range.from, "PPP", { locale: fr })} - ${format(range.to, "PPP", { locale: fr })}`
  }

  const breadcrumbs = [{ label: "Planification", href: "/schedule" }]

  return (
    <div>
      <Header title="Planification" breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader
          title="Planification des Soutenances"
          description="Générez et visualisez le planning des soutenances"
        >
          <div className="flex gap-2">
            <Button
              onClick={() => setTab("generate")}
              variant={tab === "generate" ? "default" : "outline"}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Générer un planning
            </Button>
            <Link href="/schedule/timetable">
              <Button variant="outline" className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                Voir l'emploi du temps
              </Button>
            </Link>
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Sélectionner une date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Planning des Soutenances</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="view">Voir le Planning</TabsTrigger>
                  <TabsTrigger value="generate">Générer un Planning</TabsTrigger>
                </TabsList>

                <TabsContent value="view">
                  <ScheduleViewer date={selectedDate} defenses={defenses} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="generate">
                  <div className="mb-6">
                    <Tabs
                      value={generationMode}
                      onValueChange={(value) => setGenerationMode(value as "single" | "range")}
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value="single">Jour unique</TabsTrigger>
                        <TabsTrigger value="range">Période</TabsTrigger>
                      </TabsList>

                      <TabsContent value="single">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">
                            Date sélectionnée:{" "}
                            <span className="font-medium">
                              {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Aucune"}
                            </span>
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="range">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">
                            Période sélectionnée: <span className="font-medium">{formatDateRange(dateRange)}</span>
                          </p>
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            className="rounded-md border mt-4"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <ScheduleGenerator
                    date={selectedDate}
                    dateRange={dateRange}
                    generationMode={generationMode}
                    onGenerate={handleGenerateSchedule}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
