// src/providers/ChatbotProvider.tsx
"use client"

import { ReactNode, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
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
  userHasNoAssignments: boolean
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const { data: session, status } = useSession()
  const [state, setState] = useState<ChatbotState>({
    messages: {},
    loading: false,
    error: null,
    userHasNoAssignments: false,
  })

  useEffect(() => {
    async function loadMessages() {
      if (status === "loading" || !session?.user?.id) return

      // Check if user has any bot assignments
      if (!session.user.botAssignments?.length) {
        setState(prev => ({
          ...prev,
          loading: false,
          userHasNoAssignments: true,
          error: null,
        }))
        return
      }

      setState(prev => ({ ...prev, loading: true }))
      try {
        const data = await fetchChatbotMessages(session.user.id)
        setState(prev => ({
          ...prev,
          messages: data,
          loading: false,
          error: null,
          userHasNoAssignments: false,
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error : new Error("An error occurred"),
          userHasNoAssignments: false,
        }))
      }
    }

    loadMessages()
  }, [session, status])

  return (
    <ChatbotContext.Provider value={state}>{children}</ChatbotContext.Provider>
  )
}
