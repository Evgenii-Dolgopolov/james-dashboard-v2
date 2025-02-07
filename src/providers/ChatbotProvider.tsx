// src/providers/ChatbotProvider.tsx
"use client"

import { ReactNode, useEffect, useState } from "react"
import { fetchChatbotMessages } from "@/lib/supabase/queries"
import { ChatbotContext } from "@/context/chatbot/ChatbotContext"
import type { Message } from "@/lib/supabase/queries"

type ChatbotProviderProps = {
  children: ReactNode
}

type ChatbotState = {
  messages: Record<string, Message[]>
  loading: boolean
  error: Error | null
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const [state, setState] = useState<ChatbotState>({
    messages: {},
    loading: false,
    error: null,
  })

  useEffect(() => {
    async function loadMessages() {
      setState(prev => ({ ...prev, loading: true }))
      try {
        const data = await fetchChatbotMessages()
        setState(prev => ({
          ...prev,
          messages: data,
          loading: false,
          error: null,
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error : new Error("An error occurred"),
        }))
      }
    }

    loadMessages()
  }, [])

  return (
    <ChatbotContext.Provider value={state}>{children}</ChatbotContext.Provider>
  )
}
