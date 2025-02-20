// src/context/chatbot/ChatbotContext.ts
import { createContext } from "react"
import { Message } from "@/lib/supabase/queries"

type ChatbotContextType = {
  messages: Record<string, Message[]>
  loading: boolean
  error: Error | null
  userHasNoAssignments: boolean
}

export const ChatbotContext = createContext<ChatbotContextType>({
  messages: {},
  loading: false,
  error: null,
  userHasNoAssignments: false,
})
