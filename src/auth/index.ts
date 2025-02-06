// src/auth/index.ts
import NextAuth from "next-auth"
import { authConfig } from "./config"
import type { DefaultSession } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  type Session = {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
export * from "./constants"
