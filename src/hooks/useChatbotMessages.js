"use client"

import { useContext } from "react"
import { ChatbotContext } from "../context/ChatbotContext"

// Custom hook to access chatbot messages and state
export const useChatbotMessages = () => {
  const context = useContext(ChatbotContext)
  console.log("ChatbotContext:", useContext(ChatbotContext))

  if (!context) {
    throw new Error("useChatbotMessages must be used within a ChatbotProvider")
  }
  console.log("ChatbotContext:", useContext(ChatbotContext))
  return context
}
