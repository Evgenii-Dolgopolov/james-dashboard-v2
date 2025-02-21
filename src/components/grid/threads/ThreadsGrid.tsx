// src/components/grid/threads/ThreadsGrid.tsx
"use client"
import { ThreadsColumns } from "./ThreadsColumns"
import { BaseGrid } from "../common/BaseGrid"
import { formatDate, calculateThreadDuration } from "@/utils/formatters"
import type { Message, Bot } from "@/lib/supabase/queries"

const formatMessages = (
  messages: Record<string, Message[]>,
  botOptions: Bot[],
) => {
  return Object.entries(messages).map(([threadId, threadMessages]) => {
    const firstMessage = threadMessages[0]
    const totalMessages = threadMessages.length
    const duration = calculateThreadDuration(threadMessages)

    // Find bot name from bot options
    const bot = botOptions.find(b => b.bot_id === firstMessage.bot_id)

    // Get message with callback info
    const messageWithCallback = threadMessages.find(
      message =>
        message.user_email !== null && message.user_email !== undefined,
    )

    return {
      ...firstMessage,
      created_at: formatDate(firstMessage.created_at),
      bot_name: bot?.bot_name || firstMessage.bot_id, // Use bot name with fallback to ID
      threadMessages,
      duration: duration,
      totalMessages: totalMessages,
      sentiment: null,
      user_email: messageWithCallback ? messageWithCallback.user_email : null,
    }
  })
}

export const ThreadsGrid = () => {
  return <BaseGrid columns={ThreadsColumns()} formatMessages={formatMessages} />
}
