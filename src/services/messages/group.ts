// src/services/messages/group.ts
import { Message } from "@/lib/supabase/queries"

export function groupMessagesByThread(
  messages: Message[],
): Record<string, Message[]> {
  return messages.reduce(
    (acc, message) => {
      const threadId = message.thread_id
      if (!acc[threadId]) acc[threadId] = []
      acc[threadId].push(message)
      return acc
    },
    {} as Record<string, Message[]>,
  )
}
