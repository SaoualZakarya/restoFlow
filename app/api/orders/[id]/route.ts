import { type NextRequest, NextResponse } from "next/server"
import { updateOrder, deleteOrder } from "@/lib/services/order.service"

export async function PUT(request: NextRequest) {
  try {
    const reqUrl = new URL(request.url)
    const pathname = reqUrl.pathname
    const id = pathname.split("/").pop()
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 })

    const updates = await request.json()
    console.log("updates", updates)

    const updatedOrder = await updateOrder(id, updates)
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Order PUT error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const reqUrl = new URL(request.url)
    const pathname = reqUrl.pathname
    const id = pathname.split("/").pop()
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 })

    console.log("DELETE ID from URL:", id)
    await deleteOrder(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Order DELETE error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur" }, { status: 500 })
  }
}
