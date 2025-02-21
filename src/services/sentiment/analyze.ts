// src/services/sentiment/analyze.ts
export type SentimentAnalysisRequest = {
  threadId: string
  messageHistory: string
  prompt: string
}

export type SentimentAnalysisResponse = {
  score: number | null
  justification?: string
  success: boolean
  error?: string
}

export async function analyzeSentiment({
  threadId,
  messageHistory,
  prompt,
}: SentimentAnalysisRequest): Promise<SentimentAnalysisResponse> {
  try {
    console.log("Starting sentiment analysis for thread:", threadId)

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

    // Step 1: Get sentiment analysis from Groq API
    console.log("Sending request to Groq API...")
    const analysisResponse = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageHistory, prompt }),
    })

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json()
      console.error("API Error Response:", errorData)
      return {
        score: null,
        success: false,
        error: errorData.error || "Failed to analyze sentiment",
      }
    }

    // Parse the response which now includes both score and justification
    const analysisData = await analysisResponse.json()
    const { score, justification } = analysisData

    console.log("Received sentiment analysis:", { score, justification })

    // Step 2: Update the database via dedicated API
    console.log("Updating database with sentiment data...")
    const updateResponse = await fetch("/api/sentiment/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId,
        score,
        justification,
      }),
    })

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      console.error("Database Update Error:", errorData)
      return {
        score,
        justification,
        success: false,
        error: errorData.error || "Failed to save sentiment data",
      }
    }

    const updateResult = await updateResponse.json()
    console.log("Database update result:", updateResult)

    return {
      score,
      justification,
      success: true,
    }
  } catch (error) {
    console.error("Exception in sentiment analysis:", error)
    return {
      score: null,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
