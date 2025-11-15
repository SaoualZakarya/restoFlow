import { type NextRequest, NextResponse } from "next/server"
import { getAllOrders, createOrder } from "@/lib/services/order.service"

export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Order GET error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newOrder = await request.json()
    const createdOrder = await createOrder(newOrder)
    return NextResponse.json(createdOrder, { status: 201 })
  } catch (error) {
    console.error("[v0] Order POST error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    )
  }
}
