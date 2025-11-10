import { type NextRequest, NextResponse } from "next/server"
import { updateMenuItem, deleteMenuItem } from "@/lib/services/menu.service"

export async function PUT(request: NextRequest) {
  const reqUrl = new URL(request.url)
    const pathname = reqUrl.pathname // e.g. "/api/menus/2c8e06b3-9721-4be4-8632-56f0a7c44db4"
    
    // Extract the last part as ID
    const id = pathname.split("/").pop()
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 })
    }
  try {
    const updates = await request.json()
    console.log("updates",updates)
    const updatedItem = await updateMenuItem(id, updates)
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("[v0] Menu PUT error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Parse the URL
    const reqUrl = new URL(request.url)
    const pathname = reqUrl.pathname // e.g. "/api/menus/2c8e06b3-9721-4be4-8632-56f0a7c44db4"
    
    // Extract the last part as ID
    const id = pathname.split("/").pop()
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 })
    }

    console.log("DELETE ID from URL:", id)
    await deleteMenuItem(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Menu DELETE error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur serveur" }, { status: 500 })
  }
}

