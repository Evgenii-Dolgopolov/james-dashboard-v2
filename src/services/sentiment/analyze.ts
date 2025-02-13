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
}

export async function analyzeSentiment({
  threadId,
  messageHistory,
  prompt,
}: SentimentAnalysisRequest): Promise<SentimentAnalysisResponse> {
  try {
    // Add logging to see what we're sending to the API
    console.log("Sending to API:", {
      messageHistory,
      prompt,
    })
    console.log(`========>${messageHistory}<=========`)

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
      throw new Error(errorData.error || "Failed to analyze sentiment")
    }

    const { score } = await response.json()

    // Update Supabase with the sentiment score
    const { error } = await supabase
      .from("chatbot")
      .update({ sentiment_analysis: score })
      .eq("thread_id", threadId)

    if (error) throw error

    return { score, success: true }
  } catch (error) {
    console.error("Error in sentiment analysis:", error)
    return { score: null, success: false }
  }
}
