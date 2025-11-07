import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data: orders } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString())

    const { data: reservations } = await supabase
      .from("reservations")
      .select("*")
      .eq("reservation_date", today.toISOString().split("T")[0])

    const { data: activeOrders } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["en attente", "en préparation", "prêt"])

    const todayRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
    const todayOrders = orders?.length || 0
    const todayReservations = reservations?.length || 0
    const activeOrdersCount = activeOrders?.length || 0
    const averageOrderValue = todayOrders > 0 ? todayRevenue / todayOrders : 0

    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: weekOrders } = await supabase
      .from("orders")
      .select("created_at, total")
      .gte("created_at", sevenDaysAgo.toISOString())

    const revenueByDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toLocaleDateString("fr-FR", { weekday: "short" })

      const dayRevenue =
        weekOrders
          ?.filter((order) => {
            const orderDate = new Date(order.created_at)
            return orderDate.toDateString() === date.toDateString()
          })
          .reduce((sum, order) => sum + Number(order.total), 0) || 0

      return { date: dateStr, revenue: dayRevenue }
    })

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("menu_item_id, quantity, menu_items(name)")
      .gte("created_at", sevenDaysAgo.toISOString())

    const itemCounts = new Map<string, { name: string; count: number }>()
    orderItems?.forEach((item: any) => {
      const name = item.menu_items?.name
      if (name) {
        const current = itemCounts.get(name) || { name, count: 0 }
        itemCounts.set(name, { name, count: current.count + item.quantity })
      }
    })

    const popularItems = Array.from(itemCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json({
      todayRevenue,
      todayOrders,
      todayReservations,
      activeOrders: activeOrdersCount,
      averageOrderValue,
      revenueByDay,
      popularItems,
    })
  } catch (error) {
    console.error("[v0] Dashboard stats error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
