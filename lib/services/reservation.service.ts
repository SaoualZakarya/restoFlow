// lib/services/reservation.service.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import type { Reservation } from "@/lib/types"

export async function getAllReservations(): Promise<Reservation[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true })
  
  if (error) throw new Error(error.message)
  
  return (data || []).map(res => ({
    ...res,
    date: new Date(res.date),
    customerName: res.customer_name,
    customerPhone: res.customer_phone,
    customerEmail: res.customer_email,
    numberOfGuests: res.number_of_guests,
    tableNumber: res.table_number,
  }))
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw new Error(error.message)
  if (!data) return null
  
  return {
    ...data,
    date: new Date(data.date),
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerEmail: data.customer_email,
    numberOfGuests: data.number_of_guests,
    tableNumber: data.table_number,
  }
}

export async function createReservation(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      customer_name: reservation.customerName,
      customer_phone: reservation.customerPhone,
      customer_email: reservation.customerEmail,
      date: reservation.date.toISOString().split('T')[0],
      time: reservation.time,
      number_of_guests: reservation.numberOfGuests,
      table_number: reservation.tableNumber,
      status: reservation.status,
      notes: reservation.notes,
    })
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  
  return {
    ...data,
    date: new Date(data.date),
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerEmail: data.customer_email,
    numberOfGuests: data.number_of_guests,
    tableNumber: data.table_number,
  }
}

export async function updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation> {
  const supabase = await createClient()
  
  const updateData: any = {}
  
  if (updates.customerName !== undefined) updateData.customer_name = updates.customerName
  if (updates.customerPhone !== undefined) updateData.customer_phone = updates.customerPhone
  if (updates.customerEmail !== undefined) updateData.customer_email = updates.customerEmail
  if (updates.date !== undefined) updateData.date = updates.date.toISOString().split('T')[0]
  if (updates.time !== undefined) updateData.time = updates.time
  if (updates.numberOfGuests !== undefined) updateData.number_of_guests = updates.numberOfGuests
  if (updates.tableNumber !== undefined) updateData.table_number = updates.tableNumber
  if (updates.status !== undefined) updateData.status = updates.status
  if (updates.notes !== undefined) updateData.notes = updates.notes
  
  const { error } = await supabase
    .from('reservations')
    .update(updateData)
    .eq('id', id)
  
  if (error) throw new Error(error.message)
  
  const reservation = await getReservationById(id)
  if (!reservation) throw new Error('Reservation not found')
  return reservation
}

export async function deleteReservation(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id)
  
  if (error) throw new Error(error.message)
}
