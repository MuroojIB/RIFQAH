import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.SUPABASE_URL 
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY 
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Warning: Supabase keys are missing in .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
