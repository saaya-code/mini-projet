"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { ScheduleGenerator } from "./schedule-generator"
import { ScheduleViewer } from "./schedule-viewer"

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
    } catch (error) {
      console.error(error)
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

      

      fetchDefenses(selectedDate!)
      setTab("view")
    } catch (error) {
      console.error(error)

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Planification des Soutenances</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Sélectionner une date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
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
  )
}

