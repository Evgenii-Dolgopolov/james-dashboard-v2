// src/lib/groq/queries.ts
import { groq } from "./client"

/**
 * Analyzes message history for sentiment using Groq API
 *
 * @param messageHistory The chat history to analyze
 * @param prompt The system prompt to guide the analysis
 * @returns A JSON string containing score and justification
 */
export async function groqSentimentAnalysis(
  messageHistory: string,
  prompt: string,
) {
  if (!messageHistory || !prompt) {
    throw new Error(
      "Both message history and prompt are required for sentiment analysis",
    )
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: messageHistory,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0, // Lower temperature for more consistent results
    })

    const result = completion.choices[0]?.message?.content

    if (!result) {
      throw new Error("No response from Groq API")
    }

    return result // Return the raw JSON string from the model
  } catch (error) {
    console.error("Error in groqSentimentAnalysis:", error)
    throw error
  }
}
