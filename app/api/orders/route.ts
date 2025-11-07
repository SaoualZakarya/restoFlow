import { type NextRequest, NextResponse } from "next/server"
import { mockOrders } from "@/lib/mock-data"

const orders = [...mockOrders]

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const newOrder = await request.json()

  await new Promise((resolve) => setTimeout(resolve, 500))

  const order = {
    id: String(Date.now()),
    tableNumber: newOrder.tableNumber,
    items: newOrder.items,
    status: newOrder.status || "en attente",
    total: newOrder.total,
    createdAt: new Date(),
    updatedAt: new Date(),
    serverName: "Jean Serveur",
  }

  orders.unshift(order)
  return NextResponse.json(order, { status: 201 })
}
