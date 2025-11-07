import { type NextRequest, NextResponse } from "next/server"
import { mockReservations } from "@/lib/mock-data"

let reservations = [...mockReservations]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = reservations.findIndex((r) => r.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    reservations[index] = {
      ...reservations[index],
      ...updates,
      date: updates.date ? new Date(updates.date) : reservations[index].date,
    }

    return NextResponse.json(reservations[index])
  } catch (error) {
    console.error("[v0] Reservation PUT error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))

    reservations = reservations.filter((r) => r.id !== params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Reservation DELETE error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
