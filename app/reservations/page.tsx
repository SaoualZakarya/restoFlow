"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CalendarIcon, Users, Phone } from "lucide-react"
import type { Reservation } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    date: "",
    time: "",
    numberOfGuests: "",
    tableNumber: "",
    notes: "",
  })

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations")
      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error)
    } finally {
      setLoading(false)
    }
  }

const [availableTables, setAvailableTables] = useState<number[]>([1,2,3,4,5,6,7,8,9,10]);

const updateAvailableTables = () => {
  if (!formData.date || !formData.time) {
    setAvailableTables([1,2,3,4,5,6,7,8,9,10]);
    return;
  }

  const bookedTables = reservations
    .filter(r => r.date === formData.date && r.time === formData.time)
    .map(r => r.tableNumber)
    .filter(Boolean) as number[];

  const allTables = [1,2,3,4,5,6,7,8,9,10];
  setAvailableTables(allTables.filter(t => !bookedTables.includes(t)));
};

useEffect(() => {
  updateAvailableTables();
}, [formData.date, formData.time, reservations]);


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const reservationData = {
  ...formData,
  numberOfGuests: Number.parseInt(formData.numberOfGuests),
  tableNumber: formData.tableNumber ? Number.parseInt(formData.tableNumber) : undefined,
  status: "en attente" as const,
  }

  try {
  const response = await fetch("/api/reservations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(reservationData),
  })

  const result = await response.json()

  if (!response.ok) {
    // Handle conflict (table already reserved)
    if (response.status === 409) {
      alert(result.error) // You can replace this with a prettier UI notification
    } else {
      alert("Erreur lors de la création de la réservation")
    }
    return
  }

  setReservations([...reservations, result])
  setIsDialogOpen(false)
  resetForm()

  } catch (error) {
  console.error("Erreur lors de la création:", error)
  alert("Erreur serveur")
  }
  }


  const updateStatus = async (id: string, status: Reservation["status"]) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const updated = await response.json()
      setReservations(reservations.map((res) => (res.id === updated.id ? updated : res)))
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      date: "",
      time: "",
      numberOfGuests: "",
      tableNumber: "",
      notes: "",
    })
  }

  const getStatusBadge = (status: Reservation["status"]) => {
    const variants = {
      confirmée: "default" as const,
      "en attente": "secondary" as const,
      annulée: "destructive" as const,
      terminée: "secondary" as const,
    }

    return <Badge variant={variants[status]}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestion des Réservations</h1>
          <p className="text-muted-foreground mt-1">Gérez les réservations de votre restaurant</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Réservation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle Réservation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nom du client</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Téléphone</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email (optionnel)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfGuests">Nombre de personnes</Label>
                  <Input
                    id="numberOfGuests"
                    type="number"
                    min="1"
                    value={formData.numberOfGuests}
                    onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tableNumber">Table (optionnel)</Label>
                  <Select
                    value={formData.tableNumber}
                    onValueChange={value => setFormData({ ...formData, tableNumber: value })}
                    disabled={availableTables.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        availableTables.length ? "Choisir une table" : "Toutes les tables réservées"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map(t => (
                        <SelectItem key={t} value={String(t)}>
                          Table {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Créer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-card-foreground">{reservation.customerName}</CardTitle>
                {getStatusBadge(reservation.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date(reservation.date).toLocaleDateString("fr-FR")} à {reservation.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{reservation.numberOfGuests} personnes</span>
                  {reservation.tableNumber && <span className="text-primary">• Table {reservation.tableNumber}</span>}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{reservation.customerPhone}</span>
                </div>
              </div>

              {reservation.notes && (
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-xs text-muted-foreground">{reservation.notes}</p>
                </div>
              )}

              <Select
                value={reservation.status}
                onValueChange={(value) => updateStatus(reservation.id, value as Reservation["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmée">Confirmée</SelectItem>
                  <SelectItem value="en attente">En attente</SelectItem>
                  <SelectItem value="annulée">Annulée</SelectItem>
                  <SelectItem value="terminée">Terminée</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
