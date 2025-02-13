// src/hooks/useChatbotMessages.ts
"use client"

import { useContext } from "react"
import { ChatbotContext } from "@/context/chatbot/ChatbotContext"

export function useChatbotMessages() {
  const context = useContext(ChatbotContext)

  if (!context) {
    throw new Error("useChatbotMessages must be used within a ChatbotProvider")
  }

  return context
}
