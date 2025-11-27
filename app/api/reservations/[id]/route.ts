import { type NextRequest, NextResponse } from "next/server"
import { updateReservation, deleteReservation, getReservationById } from "@/lib/services/reservation.service"

// PUT /api/reservations/:id
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
try {
const updates = await request.json()
const updatedReservation = await updateReservation(params.id, {
customerName: updates.customerName,
customerPhone: updates.customerPhone,
customerEmail: updates.customerEmail,
date: updates.date ? new Date(updates.date) : undefined,
time: updates.time,
numberOfGuests: updates.numberOfGuests,
tableNumber: updates.tableNumber,
status: updates.status,
notes: updates.notes,
})

return NextResponse.json(updatedReservation)

} catch (error) {
console.error(" Reservation PUT error:", error)
return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur" }, { status: 500 })
}
}

// DELETE /api/reservations/:id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
try {
const reservation = await getReservationById(params.id)
if (!reservation) {
return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
}

await deleteReservation(params.id)
return NextResponse.json({ success: true })
} catch (error) {
console.error(" Reservation DELETE error:", error)
return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur" }, { status: 500 })
}
}
