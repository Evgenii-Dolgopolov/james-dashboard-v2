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

  const hasMessageContent = (message: Message): boolean => {
    return !!(
      message.user_message ||
      message.suggested_message ||
      message.bot_message ||
      message.user_email
    )
  }

  const formatMessages = (
    messages: Record<string, Message[]>,
    botOptions: Bot[],
  ) => {
    let formattedMessages = Object.entries(messages)
      .flatMap(([_, threadMessages]) => {
        // Sort messages within thread chronologically (ascending)
        return [...threadMessages].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
      })
      .filter(hasMessageContent)
      .map((message: Message) => {
        let botName
        if (hasSingleBot) {
          botName = singleBotName || message.bot_id
        } else {
          const bot = botOptions.find(b => b.bot_id === message.bot_id)
          botName = bot?.bot_name || message.bot_id
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
