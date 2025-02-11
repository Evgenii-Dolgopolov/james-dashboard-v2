// src/services/sentiment/analyze.ts
import { supabase } from "@/lib/supabase/client"

export type SentimentAnalysisRequest = {
  threadId: string
  messageHistory: string
  prompt: string
}

export type SentimentAnalysisResponse = {
  score: number
}

export async function analyzeSentiment({
  threadId,
  messageHistory,
  prompt,
}: SentimentAnalysisRequest): Promise<SentimentAnalysisResponse> {
  try {
    // TODO: Add actual Groq API call here
    const mockScore = Math.random() * 10 // Placeholder for now

    // Update Supabase with the sentiment score
    const { error } = await supabase
      .from("chatbot")
      .update({ sentiment_analysis: mockScore })
      .eq("thread_id", threadId)

    if (error) throw error

    return { score: mockScore }
  } catch (error) {
    console.error("Error in sentiment analysis:", error)
    throw error
  }
}
