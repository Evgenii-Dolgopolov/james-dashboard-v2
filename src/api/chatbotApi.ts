import axios from "axios"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_APIKEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create an Axios instance for Supabase
const supabase = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`, // Correct base URL
  headers: {
    apikey: SUPABASE_APIKEY, // Supabase API key
    Authorization: `Bearer ${SUPABASE_APIKEY}`, // Authorization header
  },
})

// Fetch chatbot messages from Supabase
export const fetchChatbotMessages = async () => {
  try {
    // Construct the full URL for debugging
    // const fullUrl = `${SUPABASE_URL}/rest/v1/chatbot?select=*`

    // Query the "chatbot" table
    const response = await supabase.get("/chatbot", {
      params: {
        select: "*", // Fetch all columns
      },
    })

    // Check if response.data is an array
    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response format: Expected an array")
    }

    // Transform data to match the table fields
    const transformedData = response.data.map(message => ({
      id: message.id,
      created_at: message.created_at, // Pass the date as-is
      bot_name: "VRG ASIA", // Hardcoded for now, replace with actual bot name if available
      thread_id: message.thread_id,
      user_message: message.user_message || "", // Fallback to empty string if undefined
      bot_message: message.bot_message || "", // Fallback to empty string if undefined
      callback: message.callback_spare1 || message.callback_spare2 || "", // Fallback to empty string if undefined
    }))

    return transformedData
  } catch (error) {
    console.error("Error fetching chatbot messages:", error)
    throw error
  }
}
