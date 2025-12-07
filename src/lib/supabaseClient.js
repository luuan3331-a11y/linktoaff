import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Only warn in dev logs, but don't crash app immediately if just viewing non-data pages
  console.warn('Missing Supabase Environment Variables')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
