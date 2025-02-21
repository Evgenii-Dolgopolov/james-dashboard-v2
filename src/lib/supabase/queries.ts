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
  sentiment_analysis?: number | null
  sentiment_analysis_justification?: string | null
  sentiment_analysis_prompt?: string | null
  chat_history?: string | null
}

export type Bot = {
  bot_name: string
  bot_id: string
}

export async function fetchSentimentPrompt(
  botId: string,
): Promise<string | null> {
  if (!botId) {
    console.error("No bot ID provided to fetchSentimentPrompt")
    return null
  }

  try {
    console.log("Fetching sentiment prompt for bot ID:", botId)

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
      console.log("No sentiment prompt found for bot ID:", botId)
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
    // First get the bot IDs from user assignments
    const { data: assignments, error: assignmentError } = await supabaseAdmin
      .from("user_bot_assignments")
      .select("bot_id")
      .eq("user_id", userId)

    if (assignmentError || !assignments?.length) {
      console.log("Error fetching bot assignments:", assignmentError)
      return []
    }

    // Get bot names from client_table for the assigned bot IDs
    const botIds = assignments.map(assignment => assignment.bot_id)
    const { data: bots, error: botsError } = await supabaseAdmin
      .from("client_table")
      .select("bot_id, bot_name")
      .in("bot_id", botIds)

    if (botsError) {
      console.log("Error fetching bot names:", botsError)
      return []
    }

    // Return the bot IDs and names
    return bots.map(bot => ({
      bot_id: bot.bot_id,
      bot_name: bot.bot_name || bot.bot_id, // Fallback to ID if name is missing
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
    // Get bot assignments for the user
    const { data: assignments, error: assignmentError } = await supabaseAdmin
      .from("user_bot_assignments")
      .select("bot_id")
      .eq("user_id", userId)

    if (assignmentError || !assignments?.length) {
      console.log("Error fetching assignments:", assignmentError)
      return {}
    }

    const botIds = assignments.map(assignment => assignment.bot_id)

    // If a specific bot is selected and valid, filter for it
    const botIdFilter =
      selectedBotId && selectedBotId !== "all" && botIds.includes(selectedBotId)
        ? selectedBotId
        : botIds

    // Query for messages, handling both single bot and multiple bot cases
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
      console.log("Messages error:", messagesError)
      return {}
    }

    return groupMessagesByThread(transformMessages(messages || []))
  } catch (error) {
    console.log("Error in fetchChatbotMessages:", error)
    return {}
  }
}
