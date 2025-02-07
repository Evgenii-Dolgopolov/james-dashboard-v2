import { supabase } from "./client"
import { groupMessagesByThread } from "@/services/messages/group"
import { transformMessages } from "@/services/messages/transform"
import { calculateThreadDuration } from "@/utils/formatters"

export type Message = {
  id: string
  created_at: string
  bot_id: string
  thread_id: string
  user_message: string | null
  bot_message: string | null
  user_email: string | null
  suggested_question: string | null
  thread_duration?: string
  total_messages?: number
}

export type Bot = {
  bot_name: string
  bot_id: string
}

// Define a type for thread duration map
type ThreadDurationInfo = {
  duration: string
  message_count: number
}

export async function fetchChatbotMessages(
  selectedBotId?: string,
): Promise<Record<string, Message[]>> {
  try {
    let allData: (Message & { thread_duration?: string })[] = []
    let start = 0
    const batchSize = 1000

    // First, create a query to calculate thread durations
    const { data: threadDurations, error: durationError } = await supabase
      .from("chatbot")
      .select("thread_id, created_at")
      .not("thread_id", "is", null)
      .order("created_at", { ascending: true })

    if (durationError) throw new Error(durationError.message)

    // Group and calculate durations client-side
    const threadDurationMap: Record<string, ThreadDurationInfo> =
      threadDurations
        ? Object.entries(
            threadDurations.reduce(
              (acc, message) => {
                if (!acc[message.thread_id]) {
                  acc[message.thread_id] = {
                    messages: [],
                    message_count: 0,
                  }
                }
                acc[message.thread_id].messages.push(message)
                acc[message.thread_id].message_count++
                return acc
              },
              {} as Record<string, { messages: any[]; message_count: number }>,
            ),
          ).reduce(
            (map, [threadId, threadData]) => {
              // Ensure there are messages in the thread
              if (threadData.messages.length > 0) {
                // Calculate duration
                const duration = calculateThreadDuration(threadData.messages)

                map[threadId] = {
                  duration,
                  message_count: threadData.message_count,
                }
              }

              return map
            },
            {} as Record<string, ThreadDurationInfo>,
          )
        : {}

    while (true) {
      let query = supabase
        .from("chatbot")
        .select(
          "id, created_at, typebot_id, thread_id, user_message, bot_message, user_email, suggested_message",
        )
        .or(
          "user_message.neq.null,suggested_message.neq.null,bot_message.neq.null,user_email.neq.null",
        )
        .order("thread_id", { ascending: false })
        .order("created_at", { ascending: true })
        .range(start, start + batchSize - 1)

      if (selectedBotId) {
        query = query.eq("typebot_id", selectedBotId)
      }

      const { data, error } = await query
      if (error) throw new Error(error.message)
      if (!data || data.length === 0) break

      const transformedData = transformMessages(data).map(message => ({
        ...message,
        thread_duration:
          threadDurationMap[message.thread_id]?.duration || "00:00:00",
        total_messages:
          threadDurationMap[message.thread_id]?.message_count || 1,
      }))

      allData = [...allData, ...transformedData]
      start += batchSize
    }

    return groupMessagesByThread(allData)
  } catch (error) {
    console.error("Error fetching chatbot messages:", error)
    throw error
  }
}

export async function fetchBotNames(): Promise<Bot[]> {
  const { data, error } = await supabase
    .from("client_table")
    .select("bot_name, bot_id")
    .not("bot_id", "is", null)
    .order("bot_name", { ascending: true })
  if (error) throw new Error(error.message)
  if (!data) return []
  return data
}
