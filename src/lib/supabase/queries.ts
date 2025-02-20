// src/lib/supabase/queries.ts
import { supabaseAdmin } from "./client"
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
  thread_duration?: string
  total_messages?: number
  sentiment_analysis?: number
  sentiment_analysis_prompt?: string | null
  chat_history?: string | null
}

export type Bot = {
  bot_name: string
  bot_id: string
}

export async function fetchBotNames(userId?: string): Promise<Bot[]> {
  if (!userId) return []

  try {
    console.log("Fetching bot names for user:", userId)

    const { data, error } = await supabaseAdmin
      .from("user_bot_assignments")
      .select("bot_id")
      .eq("user_id", userId)

    if (error) {
      console.log("Error fetching bot assignments:", error)
      return []
    }

    return data.map(assignment => ({
      bot_id: assignment.bot_id,
      bot_name: assignment.bot_id,
    }))
  } catch (error) {
    console.log("Error in fetchBotNames:", error)
    return []
  }
}

export async function fetchChatbotMessages(
  userId?: string,
  selectedBotId?: string,
): Promise<Record<string, Message[]>> {
  if (!userId) return {}

  try {
    const { data: assignments, error: assignmentError } = await supabaseAdmin
      .from("user_bot_assignments")
      .select("bot_id")
      .eq("user_id", userId)

    if (assignmentError || !assignments?.length) {
      console.log("Error fetching assignments:", assignmentError)
      return {}
    }

    const botId = assignments[0].bot_id
    console.log("Fetching messages for bot:", botId)

    const { data: messages, error: messagesError } = await supabaseAdmin
      .from("chatbot")
      .select()
      .eq("typebot_id", botId)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.log("Messages error:", messagesError)
      return {}
    }

    return groupMessagesByThread(transformMessages(messages || []))
  } catch (error) {
    console.log("Error in fetchChatbotMessages:", error)
    return {}
  }
}
