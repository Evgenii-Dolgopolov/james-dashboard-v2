"use client"

import { ReactNode, useEffect, useState } from "react"
import { fetchChatbotMessages } from "../api/chatbotApi"
import { ChatbotContext } from "../context/ChatbotContext"

export default function ChatbotProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true)
      try {
        const data = await fetchChatbotMessages()
        setMessages(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Failed to fetch messages")
      } finally {
        setLoading(false)
      }
    }

    getMessages()
  }, [])

  return (
    <ChatbotContext.Provider value={{ messages, loading, error }}>
      {children}
    </ChatbotContext.Provider>
  )
}
