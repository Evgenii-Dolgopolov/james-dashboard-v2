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

    return {
      ...firstMessage,
      created_at: formatDate(firstMessage.created_at),
      bot_name:
        botOptions.find(b => b.bot_id === firstMessage.bot_id)?.bot_name ||
        firstMessage.bot_id,
      threadMessages,
      duration: duration,
      totalMessages: totalMessages,
    }
  })
}

export const ThreadsGrid = () => {
  return <BaseGrid columns={ThreadsColumns()} formatMessages={formatMessages} />
}
