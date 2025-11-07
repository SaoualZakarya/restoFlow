import { type NextRequest, NextResponse } from "next/server"
import { mockMenuItems } from "@/lib/mock-data"

let menuItems = [...mockMenuItems]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = menuItems.findIndex((m) => m.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 })
    }

    menuItems[index] = {
      ...menuItems[index],
      ...updates,
    }

    return NextResponse.json(menuItems[index])
  } catch (error) {
    console.error("[v0] Menu PUT error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))

    menuItems = menuItems.filter((m) => m.id !== params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Menu DELETE error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
