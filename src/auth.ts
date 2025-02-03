import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "./utils/supabaseClient"

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Auth attempt with email:", credentials?.email)

          // Use Supabase Auth to sign in
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials?.email || "",
            password: credentials?.password || "",
          })

          console.log("Supabase auth response:", { data, error })

          if (error || !data.user) {
            console.log("Authentication failed:", error?.message)
            throw new Error(error?.message || "Invalid credentials")
          }

          // Fetch additional user data from public.users
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (userError || !userData) {
            console.log("User data not found:", userError?.message)
            throw new Error("User data not found")
          }

          console.log("Authentication successful for user:", userData)
          return {
            id: userData.id,
            email: userData.email,
            name: userData.name || "",
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
