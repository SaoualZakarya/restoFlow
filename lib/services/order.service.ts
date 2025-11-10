"use server"

import { createClient } from "@/lib/supabase/server"
import type { Order, OrderItem } from "@/lib/types"

export async function getAllOrders(): Promise<Order[]> {
  const supabase = await createClient()
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        menu_item_id,
        menu_item_name,
        quantity,
        price,
        notes
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  
  return (orders || []).map(order => ({
    ...order,
    items: order.order_items?.map((item: any) => ({
      menuItemId: item.menu_item_id,
      menuItemName: item.menu_item_name,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes,
    })) || [],
    createdAt: new Date(order.created_at),
    updatedAt: new Date(order.updated_at),
    tableNumber: order.table_number,
    serverName: order.server_name,
  }))
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createClient()
  
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        menu_item_id,
        menu_item_name,
        quantity,
        price,
        notes
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) throw new Error(error.message)
  if (!order) return null
  
  return {
    ...order,
    items: order.order_items?.map((item: any) => ({
      menuItemId: item.menu_item_id,
      menuItemName: item.menu_item_name,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes,
    })) || [],
    createdAt: new Date(order.created_at),
    updatedAt: new Date(order.updated_at),
    tableNumber: order.table_number,
    serverName: order.server_name,
  }
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const supabase = await createClient()
  
  // Get current user for server_name
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  
  // Get user details
  const { data: userData } = await supabase
    .from('users')
    .select('name')
    .eq('id', user.id)
    .single()
  
  // Create order
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      table_number: order.tableNumber,
      status: order.status,
      total: order.total,
      server_id: user.id,
      server_name: userData?.name || order.serverName,
    })
    .select()
    .single()
  
  if (orderError) throw new Error(orderError.message)
  
  // Create order items
  if (order.items.length > 0) {
    const orderItems = order.items.map(item => ({
      order_id: newOrder.id,
      menu_item_id: item.menuItemId,
      menu_item_name: item.menuItemName,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes,
    }))
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    if (itemsError) throw new Error(itemsError.message)
  }
  
  // Return the full order with items
  const fullOrder = await getOrderById(newOrder.id)
  if (!fullOrder) throw new Error('Failed to create order')
  return fullOrder
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  const supabase = await createClient()
  
  const updateData: any = {}
  
  if (updates.tableNumber !== undefined) updateData.table_number = updates.tableNumber
  if (updates.status !== undefined) updateData.status = updates.status
  if (updates.total !== undefined) updateData.total = updates.total
  if (updates.serverName !== undefined) updateData.server_name = updates.serverName
  
  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', id)
  
  if (error) throw new Error(error.message)
  
  const order = await getOrderById(id)
  if (!order) throw new Error('Order not found')
  return order
}

export async function deleteOrder(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)
  
  if (error) throw new Error(error.message)
}

export async function addOrderItem(orderId: string, item: OrderItem): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('order_items')
    .insert({
      order_id: orderId,
      menu_item_id: item.menuItemId,
      menu_item_name: item.menuItemName,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes,
    })
  
  if (error) throw new Error(error.message)
  
  // Recalculate order total
  await recalculateOrderTotal(orderId)
}

export async function removeOrderItem(orderId: string, itemId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('order_items')
    .delete()
    .eq('id', itemId)
  
  if (error) throw new Error(error.message)
  
  // Recalculate order total
  await recalculateOrderTotal(orderId)
}

async function recalculateOrderTotal(orderId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: items, error } = await supabase
    .from('order_items')
    .select('quantity, price')
    .eq('order_id', orderId)
  
  if (error) throw new Error(error.message)
  
  const total = (items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0)
  
  await supabase
    .from('orders')
    .update({ total })
    .eq('id', orderId)
}
