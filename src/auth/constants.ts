// src/auth/constants.ts
export const PROTECTED_ROUTES = [
  "/charts",
  "/dashboard",
  "/dashboard/messages",
  "/dashboard/threads",
  "/dashboard/callbacks",
] as const

export type AuthErrorType = {
  NO_BOT_ASSIGNMENTS: string
  UNAUTHORIZED: string
  SESSION_EXPIRED: string
}

export const AUTH_ERROR_MESSAGES: AuthErrorType = {
  NO_BOT_ASSIGNMENTS: "You don't have any bots assigned to your account",
  UNAUTHORIZED: "You don't have permission to access this resource",
  SESSION_EXPIRED: "Your session has expired. Please sign in again",
} as const
