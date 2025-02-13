// src/lib/groq/queries.ts
import { groq } from "./client"

export async function groqSentimentAnalysis(prompt: string, messageHistory: string) {
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

  return result
}
