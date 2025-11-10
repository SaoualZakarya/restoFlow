// lib/services/invoice.service.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import type { Invoice } from "@/lib/types"

export async function getAllInvoices(): Promise<Invoice[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  
  return (data || []).map(inv => ({
    ...inv,
    createdAt: new Date(inv.created_at),
    orderId: inv.order_id,
    paymentMethod: inv.payment_method,
  }))
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw new Error(error.message)
  if (!data) return null
  
  return {
    ...data,
    createdAt: new Date(data.created_at),
    orderId: data.order_id,
    paymentMethod: data.payment_method,
  }
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      order_id: invoice.orderId,
      amount: invoice.amount,
      tax: invoice.tax,
      total: invoice.total,
      payment_method: invoice.paymentMethod,
      status: invoice.status,
    })
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  
  return {
    ...data,
    createdAt: new Date(data.created_at),
    orderId: data.order_id,
    paymentMethod: data.payment_method,
  }
}

export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
  const supabase = await createClient()
  
  const updateData: any = {}
  
  if (updates.status !== undefined) updateData.status = updates.status
  if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod
  
  const { error } = await supabase
    .from('invoices')
    .update(updateData)
    .eq('id', id)
  
  if (error) throw new Error(error.message)
  
  const invoice = await getInvoiceById(id)
  if (!invoice) throw new Error('Invoice not found')
  return invoice
}