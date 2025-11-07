import { type NextRequest, NextResponse } from "next/server"
import { mockOrders } from "@/lib/mock-data"

let orders = [...mockOrders]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = orders.findIndex((o) => o.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date(),
    }

    return NextResponse.json(orders[index])
  } catch (error) {
    console.error("[v0] Order PUT error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))

    orders = orders.filter((o) => o.id !== params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Order DELETE error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
