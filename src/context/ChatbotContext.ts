import { createContext } from "react"

// Create a context for chatbot messages
export const ChatbotContext = createContext<{
  messages: any[],
  loading: boolean,
  error: any,
}>({
  messages: [],
  loading: false,
  error: null,
})
