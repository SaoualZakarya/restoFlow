// lib/services/dashboard.service.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import type { DashboardStats } from "@/lib/types"

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  
  // Get today's orders
  const { data: todayOrders, error: ordersError } = await supabase
    .from('orders')
    .select('total, status')
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)
  
  if (ordersError) throw new Error(ordersError.message)
  
  // Get today's reservations
  const { data: todayReservations, error: reservationsError } = await supabase
    .from('reservations')
    .select('id')
    .eq('date', today)
  
  if (reservationsError) throw new Error(reservationsError.message)
  
  // Get active orders
  const { data: activeOrders, error: activeError } = await supabase
    .from('orders')
    .select('id')
    .in('status', ['en attente', 'en préparation', 'prêt'])
  
  if (activeError) throw new Error(activeError.message)
  
  // Calculate stats
  const todayRevenue = (todayOrders || []).reduce((sum, order) => sum + Number(order.total), 0)
  const todayOrdersCount = (todayOrders || []).length
  const averageOrderValue = todayOrdersCount > 0 ? todayRevenue / todayOrdersCount : 0
  
  // Get popular items (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: popularItems, error: popularError } = await supabase
    .from('order_items')
    .select('menu_item_name, quantity')
    .gte('created_at', sevenDaysAgo.toISOString())
  
  if (popularError) throw new Error(popularError.message)
  
  // Aggregate popular items
  const itemCounts: { [key: string]: number } = {}
  ;(popularItems || []).forEach(item => {
    itemCounts[item.menu_item_name] = (itemCounts[item.menu_item_name] || 0) + item.quantity
  })
  
  const popularItemsArray = Object.entries(itemCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  // Get revenue by day (last 7 days)
  const revenueByDay = []
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const { data: dayOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', `${dateStr}T00:00:00`)
      .lte('created_at', `${dateStr}T23:59:59`)
    
    const revenue = (dayOrders || []).reduce((sum, order) => sum + Number(order.total), 0)
    revenueByDay.push({
      date: days[date.getDay()],
      revenue: Math.round(revenue * 100) / 100,
    })
  }
  
  return {
    todayRevenue: Math.round(todayRevenue * 100) / 100,
    todayOrders: todayOrdersCount,
    todayReservations: (todayReservations || []).length,
    activeOrders: (activeOrders || []).length,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    popularItems: popularItemsArray,
    revenueByDay,
  }
}