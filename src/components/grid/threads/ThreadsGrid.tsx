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
  return Object.values(messages)
    .map(thread => thread[0]) // Take first message from each thread
    .map((message: Message) => ({
      ...message,
      created_at: formatDate(message.created_at),
      bot_name:
        botOptions.find(b => b.bot_id === message.bot_id)?.bot_name ||
        message.bot_id,
    }))
}

export const ThreadsGrid = () => {
  return <BaseGrid columns={ThreadsColumns()} formatMessages={formatMessages} />
}
