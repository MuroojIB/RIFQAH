import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("تحذير: مفاتيح Supabase غير متوفرة في ملف .env")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)