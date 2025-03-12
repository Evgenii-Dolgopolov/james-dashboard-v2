// src/components/grid/callback/CallbackGrid.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { MessagesColumns } from "../messages/MessagesColumns"
import { BaseGrid } from "../common/BaseGrid"
import { formatDate } from "@/utils/formatters"
import { useBotAssignments } from "@/hooks/useBotAssignments"
import type { Message, Bot } from "@/lib/supabase/queries"

export const CallbacksGrid = () => {
  const searchParams = useSearchParams()
  const threadFilter = searchParams.get("thread")
  const { hasSingleBot, singleBotName } = useBotAssignments()

  // Helper function to check if a message has callback information
  const hasCallbackInfo = (message: Message): boolean => {
    return !!(
      message.user_name ||
      message.user_email ||
      message.user_phone ||
      message.user_company ||
      message.user_callback_message
    )
  }

  // Helper function to check if a message has any of the specified fields
  const hasRequiredFields = (message: Message): boolean => {
    return !!(
      message.user_message ||
      message.suggested_question ||
      message.bot_message ||
      message.user_name ||
      message.user_email ||
      message.user_phone ||
      message.user_company ||
      message.user_callback_message
    )
  }

  const formatMessages = (
    messages: Record<string, Message[]>,
    botOptions: Bot[],
  ) => {
    // Filter to only include threads that have at least one message with callback info and user_email
    const callbackThreads = Object.entries(messages).filter(
      ([_, threadMessages]) =>
        threadMessages.some(hasCallbackInfo) &&
        threadMessages.some(message => !!message.user_email),
    )

    let formattedMessages = callbackThreads
      .flatMap(([_, threadMessages]) => {
        // Reverse the order of messages within each thread
        return threadMessages.reverse()
      })
      .filter(hasRequiredFields)
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
