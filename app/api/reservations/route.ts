import { type NextRequest, NextResponse } from "next/server"
import {
getAllReservations,
createReservation
} from '@/lib/services/reservation.service'

// GET /api/reservations
export async function GET() {
try {
const reservations = await getAllReservations()

// Sort by date then time ascending
const sorted = reservations.sort((a, b) => {
  if (a.date.getTime() !== b.date.getTime()) {
    return a.date.getTime() - b.date.getTime()
  }
  return a.time.localeCompare(b.time)
})

return NextResponse.json(sorted)
} catch (error) {
console.error("[v0] Reservations GET error:", error)
return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
}
}

// POST /api/reservations
// POST /api/reservations
export async function POST(request: NextRequest) {
try {
const newReservation = await request.json()

// Validate required fields
if (!newReservation.customerName || !newReservation.date || !newReservation.time || !newReservation.tableNumber) {
  return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
}

// Check if the table is already reserved for the same date and time
const allReservations = await getAllReservations()
const isTaken = allReservations.some(r =>
  r.tableNumber === newReservation.tableNumber &&
  r.date.toISOString().split('T')[0] === new Date(newReservation.date).toISOString().split('T')[0] &&
  r.time === newReservation.time
)

if (isTaken) {
  return NextResponse.json({ error: `Table ${newReservation.tableNumber} déjà réservée à cette date et heure` }, { status: 409 })
}

const reservation = await createReservation({
  customerName: newReservation.customerName,
  customerPhone: newReservation.customerPhone,
  customerEmail: newReservation.customerEmail,
  date: new Date(newReservation.date),
  time: newReservation.time,
  numberOfGuests: newReservation.numberOfGuests,
  tableNumber: newReservation.tableNumber,
  status: newReservation.status || "confirmée",
  notes: newReservation.notes,
})

return NextResponse.json(reservation, { status: 201 })

} catch (error) {
console.error("[v0] Reservations POST error:", error)
return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
}
}
