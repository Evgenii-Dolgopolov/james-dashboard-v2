// Reason: Creates a central export point for auth functionality
import NextAuth from "next-auth"
import { authConfig } from "./config"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
export * from "./constants"
