// src/auth/index.ts
import NextAuth from "next-auth"
import { authConfig } from "./config"

type ExtendedUser = {
  id: string
  email: string | null
  name?: string | null
}

declare module "next-auth" {
  type Session = {
    user: ExtendedUser
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
export * from "./constants"
