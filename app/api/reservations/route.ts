import { type NextRequest, NextResponse } from "next/server"
import { mockReservations } from "@/lib/mock-data"

const reservations = [...mockReservations]

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const sorted = [...reservations].sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.getTime() - a.date.getTime()
      }
      return b.time.localeCompare(a.time)
    })

    return NextResponse.json(sorted)
  } catch (error) {
    console.error("[v0] Reservations route error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newReservation = await request.json()

    await new Promise((resolve) => setTimeout(resolve, 500))

    const reservation = {
      id: String(Date.now()),
      customerName: newReservation.customerName,
      customerPhone: newReservation.customerPhone,
      customerEmail: newReservation.customerEmail,
      date: new Date(newReservation.date),
      time: newReservation.time,
      numberOfGuests: newReservation.numberOfGuests,
      tableNumber: newReservation.tableNumber,
      status: newReservation.status || "confirmée",
      notes: newReservation.notes,
    }

    reservations.unshift(reservation)
    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error("[v0] Reservations POST error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
