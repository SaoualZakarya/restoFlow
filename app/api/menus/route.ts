import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: menuItems, error } = await supabase.from("menu_items").select("*").order("category").order("name")

    if (error) throw error

    return NextResponse.json(menuItems || [])
  } catch (error) {
    console.error("[v0] Menu route error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const newItem = await request.json()

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        category: newItem.category,
        available: newItem.available ?? true,
        image_url: newItem.image_url,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Menu POST error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
