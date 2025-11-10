// lib/services/auth.service.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signUp(email: string, password: string, name: string, role: 'admin' | 'serveur' | 'cuisinier') {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  // Insert into users table
  if (data.user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        name,
        email,
        role,
      })
    
    if (insertError) {
      throw new Error(insertError.message)
    }
  }
  
  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (userError) {
    throw new Error(userError.message)
  }
  
  return userData
}