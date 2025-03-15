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

const ERRORS = {
  THREAD_ID_REQUIRED: "Thread ID is required",
  MESSAGE_HISTORY_REQUIRED: "Message history is required",
  PROMPT_REQUIRED: "Sentiment prompt is required",
  API_ERROR: "Failed to analyze sentiment",
  DATABASE_ERROR: "Failed to save sentiment data",
}

async function callGroqApi(messageHistory: string, prompt: string) {
  return fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messageHistory, prompt }),
  })
}

async function updateSentimentDatabase(
  threadId: string,
  score: number | null,
  justification?: string,
) {
  return fetch("/api/sentiment/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId, score, justification }),
  })
}

async function handleApiResponse(response: Response, errorMessage: string) {
  if (!response.ok) {
    const errorData = await response.json()
    console.error("API Error Response:", errorData)
    return {
      score: null,
      success: false,
      error: errorData.error || errorMessage,
    }
  }
  return null // No errors
}

function validateInput(
  request: SentimentAnalysisRequest,
): SentimentAnalysisResponse | null {
  if (!request.threadId) {
    return { score: null, success: false, error: ERRORS.THREAD_ID_REQUIRED }
  }
  if (!request.messageHistory) {
    return {
      score: null,
      success: false,
      error: ERRORS.MESSAGE_HISTORY_REQUIRED,
    }
  }
  if (!request.prompt) {
    return { score: null, success: false, error: ERRORS.PROMPT_REQUIRED }
  }
  return null // No errors
}

export async function analyzeSentiment({
  threadId,
  messageHistory,
  prompt,
}: SentimentAnalysisRequest): Promise<SentimentAnalysisResponse> {
  try {
    const validationError = validateInput({ threadId, messageHistory, prompt })
    if (validationError) {
      return validationError
    }

    const analysisResponse = await callGroqApi(messageHistory, prompt)
    const apiError = await handleApiResponse(analysisResponse, ERRORS.API_ERROR)
    if (apiError) {
      return apiError
    }

    const { score, justification } = await analysisResponse.json()

    const updateResponse = await updateSentimentDatabase(
      threadId,
      score,
      justification,
    )
    const updateError = await handleApiResponse(
      updateResponse,
      ERRORS.DATABASE_ERROR,
    )
    if (updateError) {
      return { ...updateError, score, justification }
    }

    return { score, justification, success: true }
  } catch (error) {
    console.error("Exception in sentiment analysis:", error)
    return {
      score: null,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
