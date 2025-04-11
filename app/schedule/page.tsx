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

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [tab, setTab] = useState("view")

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Impossible de charger les soutenances")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSchedule = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/schedule/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du planning")
      }

      toast.success("Planning généré avec succès")

      fetchDefenses(selectedDate!)
      setTab("view")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Une erreur est survenue lors de la génération du planning")
    } finally {
      setIsLoading(false)
    }
  }

  const breadcrumbs = [{ label: "Planification", href: "/schedule" }]

  return (
    <div>
      <Header  breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader
          title="Planification des Soutenances"
          description="Générez et visualisez le planning des soutenances"
        >
          <div className="flex gap-2">
            <Button onClick={() => setTab("generate")} variant={tab === "generate" ? "default" : "outline"}>
              Générer un planning
            </Button>
            <Link href="/schedule/timetable">
              <Button variant="outline" className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                Voir l&apos;emploi du temps
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
                  <ScheduleGenerator date={selectedDate} onGenerate={handleGenerateSchedule} isLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
