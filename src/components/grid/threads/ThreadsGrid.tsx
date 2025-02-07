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
  return Object.entries(messages).map(([_, threadMessages]) => {
    const firstMessage = threadMessages[0]

    const formattedMessage = {
      ...firstMessage,
      created_at: formatDate(firstMessage.created_at),
      botName:
        botOptions.find(b => b.bot_id === firstMessage.bot_id)?.bot_name ||
        firstMessage.bot_id,
      threadMessages,
      duration: calculateThreadDuration(threadMessages), // Pre-calculate duration
      totalMessages: threadMessages.length, // Add total message count
    } as Message & {
      threadMessages: Message[]
      duration: string
      totalMessages: number
    }

    return formattedMessage
  })
}

export const ThreadsGrid = () => {
  return <BaseGrid columns={ThreadsColumns()} formatMessages={formatMessages} />
}
