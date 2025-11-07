import { type NextRequest, NextResponse } from "next/server"
import { mockInvoices } from "@/lib/mock-data"

const invoices = [...mockInvoices]

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const sorted = [...invoices].sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    return NextResponse.json(sorted)
  } catch (error) {
    console.error("[v0] Invoices route error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newInvoice = await request.json()

    await new Promise((resolve) => setTimeout(resolve, 500))

    const invoiceNumber = `INV${String(invoices.length + 1).padStart(6, "0")}`

    const invoice = {
      id: String(Date.now()),
      orderId: newInvoice.orderId,
      amount: newInvoice.amount,
      tax: newInvoice.tax,
      total: newInvoice.total,
      paymentMethod: newInvoice.paymentMethod,
      createdAt: new Date(),
      status: newInvoice.status || "payée",
    }

    invoices.unshift(invoice)
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("[v0] Invoices POST error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
