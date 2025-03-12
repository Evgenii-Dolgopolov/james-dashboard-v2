// src/components/grid/threads/ThreadsGrid.tsx
"use client"

import { ThreadsColumns } from "./ThreadsColumns"
import { BaseGrid } from "../common/BaseGrid"
import { formatDate, calculateThreadDuration } from "@/utils/formatters"
import { useBotAssignments } from "@/hooks/useBotAssignments"
import type { Message, Bot } from "@/lib/supabase/queries"

export const ThreadsGrid = () => {
  const { hasSingleBot, singleBotName } = useBotAssignments()

  const formatMessages = (
    messages: Record<string, Message[]>,
    botOptions: Bot[],
  ) => {
    // Added filter to only include threads with more than one message
    return Object.entries(messages)
      .filter(([_, threadMessages]) => threadMessages.length > 1) // New filter
      .map(([threadId, threadMessages]) => {
        const firstMessage = threadMessages[0]
        const totalMessages = threadMessages.length - 1
        const duration = calculateThreadDuration(threadMessages)

        let botName
        if (hasSingleBot) {
          botName = singleBotName || firstMessage.bot_id
        } else {
          const bot = botOptions.find(b => b.bot_id === firstMessage.bot_id)
          botName = bot?.bot_name || firstMessage.bot_id
        }

        // Get message with callback info
        const messageWithCallback = threadMessages.find(
          message =>
            message.user_email !== null && message.user_email !== undefined,
        )

        return {
          ...firstMessage,
          created_at: formatDate(firstMessage.created_at),
          bot_name: botName,
          threadMessages,
          duration: duration,
          totalMessages: totalMessages,
          sentiment: null,
          user_email: messageWithCallback
            ? messageWithCallback.user_email
            : null,
        }
      })
  }

  return <BaseGrid columns={ThreadsColumns()} formatMessages={formatMessages} />
}
