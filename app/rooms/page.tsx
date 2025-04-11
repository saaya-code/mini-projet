"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/layout/page-header"
import { Search } from "lucide-react"
import { RoomForm } from "./room-form"
import { Badge } from "@/components/ui/badge"

interface Room {
  _id: string
  name: string
  capacity: number
  building: string
  floor: number
  isAvailable: boolean
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [activeTab, setActiveTab] = useState("list")

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms")
      const data = await response.json()
      setRooms(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Impossible de charger les salles")
    }
  }

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.capacity.toString().includes(searchTerm) ||
      room.floor.toString().includes(searchTerm),
  )

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room)
    setActiveTab("edit")
  }

  const breadcrumbs = [{ label: "Salles", href: "/rooms" }]

  return (
    <div>
      <Header breadcrumbs={breadcrumbs} />
      <div className="container py-10">
        <PageHeader title="Gestion des Salles" description="Gérez les salles disponibles pour les soutenances">
          <Button onClick={() => setActiveTab("add")}>Ajouter une salle</Button>
        </PageHeader>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une salle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Liste des Salles</TabsTrigger>
            <TabsTrigger value="add">Ajouter une Salle</TabsTrigger>
            {selectedRoom && <TabsTrigger value="edit">Modifier une Salle</TabsTrigger>}
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Salles</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredRooms.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    {searchTerm ? "Aucune salle ne correspond à votre recherche" : "Aucune salle n'a été ajoutée"}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Bâtiment</TableHead>
                        <TableHead>Étage</TableHead>
                        <TableHead>Capacité</TableHead>
                        <TableHead>Disponibilité</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRooms.map((room) => (
                        <TableRow key={room._id}>
                          <TableCell className="font-medium">{room.name}</TableCell>
                          <TableCell>{room.building}</TableCell>
                          <TableCell>{room.floor}</TableCell>
                          <TableCell>{room.capacity} personnes</TableCell>
                          <TableCell>
                            <Badge variant={room.isAvailable ? "default" : "destructive"}>
                              {room.isAvailable ? "Disponible" : "Indisponible"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleSelectRoom(room)}>
                              Modifier
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une Salle</CardTitle>
              </CardHeader>
              <CardContent>
                <RoomForm
                  onSuccess={() => {
                    fetchRooms()
                    setActiveTab("list")
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {selectedRoom && (
            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle>Modifier une Salle</CardTitle>
                </CardHeader>
                <CardContent>
                  <RoomForm
                    room={selectedRoom}
                    onSuccess={() => {
                      fetchRooms()
                      setActiveTab("list")
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
