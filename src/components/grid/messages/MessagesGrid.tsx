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

  // Added helper function to check if a message has content
  const hasMessageContent = (message: Message): boolean => {
    return !!(
      message.user_message ||
      message.suggested_question ||
      message.bot_message ||
      message.user_email
    )
  }

  const formatMessages = (
    messages: Record<string, Message[]>,
    botOptions: Bot[],
  ) => {
    let formattedMessages = Object.values(messages)
      .flat()
      // Added filter to remove messages without content
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
