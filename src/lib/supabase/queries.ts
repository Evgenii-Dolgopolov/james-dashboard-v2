import { supabase } from "./client"
import { groupMessagesByThread } from "@/services/messages/group"
import { transformMessages } from "@/services/messages/transform"

export type Message = {
  id: string
  created_at: string
  bot_id: string
  thread_id: string
  user_message: string | null
  bot_message: string | null
  user_email: string | null
  suggested_question: string | null
}

export type Bot = {
  bot_name: string
  bot_id: string
}

export async function fetchChatbotMessages(
  selectedBotId?: string,
): Promise<Record<string, Message[]>> {
  try {
    let allData: Message[] = []
    let start = 0
    const batchSize = 1000

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

      const transformedData = transformMessages(data)
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
