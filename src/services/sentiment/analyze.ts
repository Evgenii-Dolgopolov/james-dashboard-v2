// src/services/sentiment/analyze.ts
import { supabase } from "@/lib/supabase/client"

export type SentimentAnalysisRequest = {
  threadId: string
  messageHistory: string
  prompt: string
}

export type SentimentAnalysisResponse = {
  score: number | null
  success: boolean
  error?: string
}

export async function analyzeSentiment({
  threadId,
  messageHistory,
  prompt,
}: SentimentAnalysisRequest): Promise<SentimentAnalysisResponse> {
  try {
    // Add extensive logging to debug the issue
    console.log("Sentiment analysis request details:", {
      threadId,
      messageHistoryLength: messageHistory?.length || 0,
      promptLength: prompt?.length || 0,
      hasThreadId: !!threadId,
      hasMessageHistory: !!messageHistory,
      hasPrompt: !!prompt,
    })

    // Validate all required fields before sending
    if (!threadId) {
      return { score: null, success: false, error: "Thread ID is required" }
    }

    if (!messageHistory) {
      return {
        score: null,
        success: false,
        error: "Message history is required",
      }
    }

    if (!prompt) {
      return {
        score: null,
        success: false,
        error: "Sentiment prompt is required",
      }
    }

    console.log(`Sending to API with prompt: ${prompt.substring(0, 50)}...`)

    const response = await fetch("/api/groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageHistory,
        prompt,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error Response:", errorData)
      return {
        score: null,
        success: false,
        error: errorData.error || "Failed to analyze sentiment",
      }
    }

    const { score } = await response.json()

    // Update Supabase with the sentiment score
    const { error } = await supabase
      .from("chatbot")
      .update({ sentiment_analysis: score })
      .eq("thread_id", threadId)

    if (error) {
      console.error("Error updating sentiment score in database:", error)
      return { score, success: false, error: "Failed to save sentiment score" }
    }

    return { score, success: true }
  } catch (error) {
    console.error("Exception in sentiment analysis:", error)
    return {
      score: null,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
