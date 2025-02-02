import { supabase } from "../utils/supabaseClient"

// Fetch chatbot messages from Supabase
export const fetchChatbotMessages = async () => {
  try {
    let allData: any = []
    let start = 0
    const batchSize = 1000 // Number of rows to fetch per request

    while (true) {
      // Query the "chatbot" table with pagination
      const { data: chatbot, error } = await supabase
        .from("chatbot")
        .select(
          "id, created_at, typebot_id, thread_id, user_message, bot_message, user_email",
        )
        .order("created_at", { ascending: false }) // Sort by most recent first
        .range(start, start + batchSize - 1) // Fetch rows in batches

      // Check for errors
      if (error) {
        throw error
      }

      // If no data is returned, break the loop
      if (!chatbot || chatbot.length === 0) {
        break
      }

      // Add the fetched data to the allData array
      allData = allData.concat(chatbot)

      // Move to the next batch
      start += batchSize
    }

    // Transform data to match the table fields
    const transformedData = allData.map(message => ({
      id: message.id,
      created_at: message.created_at,
      bot_name: message.typebot_id,
      thread_id: message.thread_id,
      user_message: message.user_message,
      bot_message: message.bot_message,
      user_email: message.user_email,
    }))

    // Group data by thread_id
    const groupedData = transformedData.reduce((acc, message) => {
      const threadId = message.thread_id
      if (!acc[threadId]) {
        acc[threadId] = []
      }
      acc[threadId].push(message)
      return acc
    }, {})

    return groupedData
  } catch (error) {
    console.error("Error fetching chatbot messages:", error)
    throw error
  }
}

// Fetch unique bot names from Supabase
export const fetchBotNames = async () => {
  try {
    const { data, error } = await supabase
      .from("client_table")
      .select("bot_name")
      .not("bot_name", "is", null)
      .order("bot_name", { ascending: true })

    if (error) throw error

    // Extract unique bot names
    const uniqueBotNames = [...new Set(data.map(item => item.bot_name))]
    return uniqueBotNames
  } catch (error) {
    console.error("Error fetching bot names:", error)
    throw error
  }
}
