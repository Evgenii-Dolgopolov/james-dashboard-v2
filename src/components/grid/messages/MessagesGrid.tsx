// src/components/grid/messages/MessagesGrid.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { MessagesColumns } from "./MessagesColumns"
import { BaseGrid } from "../common/BaseGrid"
import { formatDate } from "@/utils/formatters"
import { useBotAssignments } from "@/hooks/useBotAssignments"
import type { Message, Bot } from "@/lib/supabase/queries"

export const MessagesGrid = () => {
  const searchParams = useSearchParams()
  const threadFilter = searchParams.get("thread")
  const { hasSingleBot, singleBotName } = useBotAssignments()

  const formatMessages = (
    messages: Record<string, Message[]>,
    botOptions: Bot[],
  ) => {
    let formattedMessages = Object.values(messages)
      .flat()
      .map((message: Message) => {
        // If user has a single bot, use that bot's name
        // Otherwise, find bot name from bot options
        let botName
        if (hasSingleBot) {
          botName = singleBotName || message.bot_id // Use single bot name with fallback to ID
        } else {
          const bot = botOptions.find(b => b.bot_id === message.bot_id)
          botName = bot?.bot_name || message.bot_id // Use bot name with fallback to ID
        }

        return {
          ...message,
          created_at: formatDate(message.created_at),
          bot_name: botName,
        }
      })

    if (threadFilter) {
      formattedMessages = formattedMessages.filter(
        message => message.thread_id === threadFilter,
      )
    }

    return formattedMessages
  }

  return (
    <BaseGrid
      columns={MessagesColumns()}
      formatMessages={formatMessages}
      threadFilter={threadFilter ?? undefined}
    />
  )
}
