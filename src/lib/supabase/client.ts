import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_APIKEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_APIKEY) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_APIKEY)
