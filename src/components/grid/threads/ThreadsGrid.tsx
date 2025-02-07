// src/components/grid/threads/ThreadsGrid.tsx
"use client"
import { ThreadsColumns } from "./ThreadsColumns"
import { BaseGrid } from "../common/BaseGrid"
import { formatDate } from "@/utils/formatters"
import type { Message, Bot } from "@/lib/supabase/queries"

const formatMessages = (
  messages: Record<string, Message[]>,
  botOptions: Bot[],
) => {
  return Object.entries(messages).map(([_, threadMessages]) => {
    const firstMessage = threadMessages[0]

    return {
      ...firstMessage, // Spread all original Message properties
      created_at: formatDate(firstMessage.created_at),
      bot_name:
        botOptions.find(b => b.bot_id === firstMessage.bot_id)?.bot_name ||
        firstMessage.bot_id,
      threadMessages, // Add threadMessages as an additional property
    } as Message & { threadMessages: Message[] } // Type assertion to include the new property
  })
}

export const ThreadsGrid = () => {
  return <BaseGrid columns={ThreadsColumns()} formatMessages={formatMessages} />
}
