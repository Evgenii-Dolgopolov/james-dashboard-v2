// src/components/grid/messages/MessagesGrid.tsx
"use client"

import { MessagesColumns } from "./MessagesColumns"
import { BaseGrid } from "../common/BaseGrid"
import { formatDate } from "@/utils/formatters"
import type { Message, Bot } from "@/lib/supabase/queries"

const formatMessages = (
  messages: Record<string, Message[]>,
  botOptions: Bot[],
) => {
  return Object.values(messages)
    .flat()
    .map((message: Message) => ({
      ...message,
      created_at: formatDate(message.created_at),
      bot_name:
        botOptions.find(b => b.bot_id === message.bot_id)?.bot_name ||
        message.bot_id,
    }))
}

export const MessagesGrid = () => {
  return (
    <BaseGrid columns={MessagesColumns()} formatMessages={formatMessages} />
  )
}
