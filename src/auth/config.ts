// src/auth/config.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "../utils/supabaseClient"

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
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials?.email || "",
            password: credentials?.password || "",
          })

          if (error || !data.user) {
            throw new Error(error?.message || "Invalid credentials")
          }

          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (userError || !userData) {
            throw new Error("User data not found")
          }

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
    // Setting a maximum age for the session
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    // Updating session every time it's checked to keep it fresh
    updateAge: 24 * 60 * 60, // 24 hours in seconds
  },
  pages: {
    signIn: "/login",
    error: "/login",
    // Adding signOut page to ensure proper cleanup
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // If this is a sign-in event, add user data to the token
      if (user) {
        token.id = user.id
        token.email = user.email
      }

      // Handle token updates if needed
      if (trigger === "update" && session) {
        // You can update token data here if needed
        return { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      // Ensure user data is properly attached to the session
      if (token && session.user) {
        session.user.id = token.id
        // You can add additional user data here if needed
      }
      return session
    },
  },
  // Adding additional security options
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set in your environment
  jwt: {
    // Maximum age of the JWT token
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
}
