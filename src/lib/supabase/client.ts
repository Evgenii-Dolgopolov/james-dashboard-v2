// src/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_ROLE = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE) {
  throw new Error("Missing Supabase environment variables")
}

// Create singleton instances
let supabaseInstance: any = null
let supabaseAdminInstance: any = null

// Get regular client for auth
export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return supabaseInstance
}

// Get admin client for direct DB access
export const getSupabaseAdmin = () => {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseAdminInstance
}

// Export instances directly if needed
export const supabase = getSupabase()
export const supabaseAdmin = getSupabaseAdmin()

// Custom error class for authorization errors
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthorizationError"
  }
}

// Helper to handle common Supabase errors
export const handleSupabaseError = (error: any) => {
  // Handle Supabase auth errors
  if (error?.code === "PGRST301" || error?.code === "42501") {
    throw new AuthorizationError(
      "You don't have permission to access this resource"
    )
  }

  // Handle session expired
  if (error?.code === "401") {
    throw new AuthorizationError(
      "Your session has expired. Please sign in again"
    )
  }

  // Handle assignment errors
  if (error?.code === "PGRST116") {
    console.log("Query returned no results:", error)
    return null
  }

  // Throw original error for other cases
  throw error
}

// Set Supabase session
export const setSupabaseSession = async (access_token: string) => {
  try {
    const { data: { session }, error } = await supabase.auth.setSession({
      access_token: access_token,
      refresh_token: ""
    })
    
    if (error) {
      console.log("Error setting Supabase session:", error)
      return null
    }
    
    return session
  } catch (error) {
    console.log("Error in setSupabaseSession:", error)
    return null
  }
}

// Get current session state
export const getSupabaseSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log("Error getting Supabase session:", error)
      return null
    }
    
    return session
  } catch (error) {
    console.log("Error in getSupabaseSession:", error)
    return null
  }
}

// Check if session is valid
export const isSessionValid = async () => {
  const session = await getSupabaseSession()
  return !!session?.access_token
}