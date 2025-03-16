// src/lib/supabase/queries.ts
import { supabaseAdmin } from "./client"
import { groupMessagesByThread } from "@/services/messages/group"
import { transformMessages } from "@/services/messages/transform"

export type Message = {
  id: string
  created_at: string
  bot_id?: string
  typebot_id?: string
  thread_id: string
  user_message?: string | null
  bot_message?: string | null
  user_email?: string | null
  suggested_message?: string | null
  user_name?: string | null
  user_phone?: string | null
  user_company?: string | null
  user_callback_message?: string | null
  thread_duration?: string
  total_messages?: number
  sentiment_analysis?: number | null
  sentiment_analysis_justification?: string | null
  sentiment_analysis_prompt?: string | null
  chat_history?: string | null
}

export type Bot = {
  bot_name: string
  bot_id: string
}

// New function to get sentiment from first message of thread
export async function getThreadSentimentFromFirstMessage(
  threadId: string,
): Promise<{
  sentiment_analysis: number | null
  sentiment_analysis_justification: string | null
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("chatbot")
      .select("sentiment_analysis, sentiment_analysis_justification")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .limit(1)
      .single()

    if (error || !data) {
      console.error("Error fetching first message sentiment:", error)
      return {
        sentiment_analysis: null,
        sentiment_analysis_justification: null,
      }
    }

    return {
      sentiment_analysis: data.sentiment_analysis,
      sentiment_analysis_justification: data.sentiment_analysis_justification,
    }
  } catch (error) {
    console.error("Exception in getThreadSentimentFromFirstMessage:", error)
    return {
      sentiment_analysis: null,
      sentiment_analysis_justification: null,
    }
  }
}

// Existing functions below remain unchanged
export async function fetchSentimentPrompt(
  botId: string,
): Promise<string | null> {
  if (!botId) {
    console.error("No bot ID provided to fetchSentimentPrompt")
    return null
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("client_table")
      .select("sentiment_analysis_prompt")
      .eq("bot_id", botId)
      .single()

    if (error) {
      console.error("Error fetching sentiment prompt:", error)
      return null
    }

    if (!data || !data.sentiment_analysis_prompt) {
      console.error("No sentiment prompt found for bot ID:", botId)
      return null
    }

    return data.sentiment_analysis_prompt
  } catch (error) {
    console.error("Exception in fetchSentimentPrompt:", error)
    return null
  }
}

export async function fetchBotNames(userId?: string): Promise<Bot[]> {
  if (!userId) return []
  try {
    const { data: assignments, error: assignmentError } = await supabaseAdmin
      .from("user_bot_assignments")
      .select("bot_id")
      .eq("user_id", userId)

    if (assignmentError || !assignments?.length) {
      return []
    }

    const botIds = assignments.map(assignment => assignment.bot_id)
    const { data: bots, error: botsError } = await supabaseAdmin
      .from("client_table")
      .select("bot_id, bot_name")
      .in("bot_id", botIds)

    if (botsError) {
      return []
    }

    return bots.map(bot => ({
      bot_id: bot.bot_id,
      bot_name: bot.bot_name ? bot.bot_name.trim() : bot.bot_id,
    }))
  } catch (error) {
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
      console.error("Error fetching assignments:", assignmentError)
      return {}
    }

    const botIds = assignments.map(assignment => assignment.bot_id)
    const botIdFilter =
      selectedBotId && selectedBotId !== "all" && botIds.includes(selectedBotId)
        ? selectedBotId
        : botIds

    const query = supabaseAdmin
      .from("chatbot")
      .select()
      .order("created_at", { ascending: false })

    if (Array.isArray(botIdFilter)) {
      query.in("typebot_id", botIdFilter)
    } else {
      query.eq("typebot_id", botIdFilter)
    }

    const { data: messages, error: messagesError } = await query

    if (messagesError) {
      console.error("Messages error:", messagesError)
      return {}
    }

    return groupMessagesByThread(transformMessages(messages || []))
  } catch (error) {
    console.log("Error in fetchChatbotMessages:", error)
    return {}
  }
}
