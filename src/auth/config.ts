// src/auth/config.ts
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase, supabaseAdmin } from "@/lib/supabase/client"

type UserData = {
  id: string
  email: string
  name: string | null
  botAssignments: string[]
  access_token: string
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          // Authenticate with Supabase
          const {
            data: { user, session },
            error: authError,
          } = await supabase.auth.signInWithPassword({
            email: credentials?.email || "",
            password: credentials?.password || "",
          })

          if (authError || !user || !session) {
            console.log("Supabase auth error:", authError)
            return null
          }

          console.log(
            "Auth successful. Getting bot assignments for user:",
            user.id,
          )

          // Get bot assignments using admin client
          const { data: assignments, error: assignmentError } =
            await supabaseAdmin
              .from("user_bot_assignments")
              .select("bot_id")
              .eq("user_id", user.id)

          if (assignmentError) {
            console.log("Failed to fetch bot assignments:", assignmentError)
            return null
          }

          console.log("Found assignments:", assignments)

          const userData: UserData = {
            id: user.id,
            email: user.email || "",
            name: null,
            botAssignments: assignments?.map(a => a.bot_id) || [],
            access_token: session.access_token,
          }

          console.log("Authorization successful:", {
            userId: userData.id,
            hasAccessToken: !!userData.access_token,
            assignmentsCount: userData.botAssignments.length,
          })

          return userData
        } catch (error) {
          console.log("Authorization error:", error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback:", {
        hasUser: !!user,
        hasToken: !!token,
        accessToken: user?.access_token ? "present" : "missing",
      })

      if (user) {
        token.access_token = user.access_token
        token.id = user.id
        token.email = user.email
        token.botAssignments = user.botAssignments
      }

      return token
    },

    async session({ session, token }) {
      console.log("Session Callback:", {
        hasAccessToken: !!token?.access_token,
        hasBotAssignments: token?.botAssignments?.length > 0,
      })

      if (token && session.user) {
        if (token.access_token) {
          const {
            data: { session: supabaseSession },
            error,
          } = await supabase.auth.setSession({
            access_token: token.access_token,
            refresh_token: "",
          })

          if (error) {
            console.log("Failed to set Supabase session:", error)
          } else {
            console.log("Supabase session set successfully")
          }
        }

        session.user.id = token.id
        session.user.botAssignments = token.botAssignments || []
      }

      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  debug: true,

  secret: process.env.NEXTAUTH_SECRET,
}
