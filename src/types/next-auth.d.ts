// src/types/next-auth.d.ts
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      botAssignments: string[]
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    botAssignments: string[]
    access_token: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    access_token: string
    botAssignments: string[]
  }
}
