  "use server"

  import { createClient } from "@/lib/supabase/server"
  import type { MenuItem } from "@/lib/types"

  export async function getAllMenuItems(): Promise<MenuItem[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
    
    if (error) throw new Error(error.message)
    
    return data || []
  }

  export async function getMenuItemById(id: string): Promise<MenuItem | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }

  export async function createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }

  export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }

  export async function deleteMenuItem(id: string): Promise<void> {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(error.message)
  }