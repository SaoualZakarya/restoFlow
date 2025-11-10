import { type NextRequest, NextResponse } from "next/server"
import { getAllMenuItems, createMenuItem } from "@/lib/services/menu.service"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const menuItems = await getAllMenuItems()
    return NextResponse.json(menuItems)
  } catch (error) {
    console.error("[v0] Menu GET error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()

    if (
      !body.name ||
      !body.category ||
      typeof body.price !== "number"
    ) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    const createdItem = await createMenuItem({
      name: body.name,
      description: body.description || "",
      price: body.price,
      category: body.category,
      available: body.available ?? true,
    })

    return NextResponse.json(createdItem, { status: 201 })
  } catch (error) {
    console.error("[v0] Menu POST error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    )
  }
}
