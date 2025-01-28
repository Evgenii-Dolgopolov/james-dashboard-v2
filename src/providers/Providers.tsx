"use client"

import { ReactNode } from "react"
import AuthProvider from "./AuthProvider"
import ChatbotProvider from "./ChatbotProvider"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatbotProvider>{children}</ChatbotProvider>
    </AuthProvider>
  )
}
