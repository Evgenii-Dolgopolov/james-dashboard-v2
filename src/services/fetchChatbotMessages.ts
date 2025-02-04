import { supabase } from "../utils/supabaseClient"

export const fetchChatbotMessages = async (selectedBotId?: string) => {
  try {
    let allData: any = []
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
        .order("created_at", { ascending: false })
        .range(start, start + batchSize - 1)

      if (selectedBotId) {
        query = query.eq("typebot_id", selectedBotId)
      }

      const { data: chatbot, error } = await query

      if (error) throw error
      if (!chatbot || chatbot.length === 0) break

      allData = allData.concat(chatbot)
      start += batchSize
    }

    const transformedData = allData.map(message => ({
      id: message.id,
      created_at: message.created_at,
      bot_id: message.typebot_id,
      thread_id: message.thread_id,
      user_message: message.user_message,
      bot_message: message.bot_message,
      user_email: message.user_email,
      suggested_question: message.suggested_message,
    }))

    const groupedData = transformedData.reduce((acc, message) => {
      const threadId = message.thread_id
      if (!acc[threadId]) acc[threadId] = []
      acc[threadId].push(message)
      return acc
    }, {})

    return groupedData
  } catch (error) {
    console.error("Error fetching chatbot messages:", error)
    throw error
  }
}

export const fetchBotNames = async () => {
  try {
    const { data, error } = await supabase
      .from("client_table")
      .select("bot_name, bot_id")
      .not("bot_id", "is", null)
      .order("bot_name", { ascending: true })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching bot names:", error)
    throw error
  }
}
