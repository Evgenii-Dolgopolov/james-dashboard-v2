// src/lib/supabase/queries.ts
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
  sentiment_analysis?: number
  sentiment_analysis_prompt?: string | null
  chat_history?: string | null
}

export type Bot = {
  bot_name: string
  bot_id: string
}

type ThreadDurationInfo = {
  messages: { created_at: string; thread_id: string }[]
  count: number
  duration: string
}

export async function fetchChatbotMessages(
  selectedBotId?: string,
): Promise<Record<string, Message[]>> {
  try {
    let allData: (Message & { thread_duration?: string })[] = []
    let start = 0
    const batchSize = 1000

    // First, fetch sentiment analysis prompts for all bots
    const { data: clientData, error: clientError } = await supabase
      .from("client_table")
      .select("bot_id, sentiment_analysis_prompt")

    if (clientError) throw new Error(clientError.message)

    // Create a map of bot_id to sentiment_analysis_prompt
    const promptMap = (clientData || []).reduce(
      (acc, client) => {
        acc[client.bot_id] = client.sentiment_analysis_prompt
        return acc
      },
      {} as Record<string, string>,
    )

    // Fetch messages to calculate thread durations
    const { data: messages, error: messagesError } = await supabase
      .from("chatbot")
      .select("thread_id, created_at")
      .not("thread_id", "is", null)
      .order("created_at", { ascending: true })

    if (messagesError) throw new Error(messagesError.message)

    // Create and populate threadDurationMap with proper typing
    const threadDurationMap: Record<string, ThreadDurationInfo> = {}

    // Group messages and calculate durations
    messages?.forEach(message => {
      if (!threadDurationMap[message.thread_id]) {
        threadDurationMap[message.thread_id] = {
          messages: [],
          count: 0,
          duration: "00:00:00",
        }
      }
      threadDurationMap[message.thread_id].messages.push(message)
      threadDurationMap[message.thread_id].count++
    })

    // Calculate duration for each thread
    Object.keys(threadDurationMap).forEach(threadId => {
      const thread = threadDurationMap[threadId]
      thread.duration = calculateThreadDuration(thread.messages)
    })

    // Fetch actual message data with pagination
    while (true) {
      let query = supabase
        .from("chatbot")
        .select(
          `
          id,
          created_at,
          typebot_id,
          thread_id,
          user_message,
          bot_message,
          user_email,
          suggested_message,
          user_name,
          user_phone,
          user_company,
          user_callback_message,
          sentiment_analysis,
          chat_history
        `,
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
        total_messages: threadDurationMap[message.thread_id]?.count || 1,
        sentiment_analysis_prompt: promptMap[message.bot_id] || null,
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
  try {
    // Add timeout to the request
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 5000),
    )

    const fetchPromise = supabase
      .from("client_table")
      .select("bot_name, bot_id")
      .not("bot_id", "is", null)
      .order("bot_name", { ascending: true })

    // Race between timeout and actual request
    const { data, error } = (await Promise.race([
      fetchPromise,
      timeoutPromise,
    ])) as any

    if (error) {
      console.error("Supabase error:", error)
      throw new Error(`Failed to fetch bots: ${error.message}`)
    }

    if (!data) {
      console.warn("No bot data received")
      return []
    }

    return data
  } catch (error) {
    console.error("Error in fetchBotNames:", error)
    throw error
  }
}
