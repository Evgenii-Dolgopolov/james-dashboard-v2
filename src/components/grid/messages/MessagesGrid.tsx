// src/components/grid/messages/MessagesGrid.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { MessagesColumns } from "./MessagesColumns"
import { BaseGrid } from "../common/BaseGrid"
import { formatDate } from "@/utils/formatters"
import type { Message, Bot } from "@/lib/supabase/queries"

const formatMessages = (
  messages: Record<string, Message[]>,
  botOptions: Bot[],
  threadFilter?: string
) => {
  let formattedMessages = Object.values(messages)
    .flat()
    .map((message: Message) => ({
      ...message,
      created_at: formatDate(message.created_at),
      bot_name:
        botOptions.find(b => b.bot_id === message.bot_id)?.bot_name ||
        message.bot_id,
    }))

  // Apply thread filter if present
  if (threadFilter) {
    formattedMessages = formattedMessages.filter(
      message => message.thread_id === threadFilter
    )
  }

  return formattedMessages
}

export const MessagesGrid = () => {
  const searchParams = useSearchParams()
  const threadFilter = searchParams.get("thread")

  return (
    <BaseGrid 
      columns={MessagesColumns()} 
      formatMessages={(messages, botOptions) => 
        formatMessages(messages, botOptions, threadFilter)
      }
      threadFilter={threadFilter ?? undefined}
    />
  )
}