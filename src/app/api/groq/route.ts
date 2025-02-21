// src/app/api/groq/route.ts
import { groqSentimentAnalysis } from "@/lib/groq/queries"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("API received body with keys:", Object.keys(body))
    console.log("Prompt present:", !!body.prompt)
    console.log("Message history present:", !!body.messageHistory)

    const { messageHistory, prompt } = body

    if (!messageHistory || !prompt) {
      console.log("Missing required fields:", {
        messageHistory: !!messageHistory,
        messageHistoryLength: messageHistory?.length || 0,
        prompt: !!prompt,
        promptLength: prompt?.length || 0,
      })

      return NextResponse.json(
        { error: "Message history and prompt are required" },
        { status: 400 },
      )
    }

    console.log("Prompt first 50 chars:", prompt.substring(0, 50))
    console.log("Message history length:", messageHistory.length)

    const result = await groqSentimentAnalysis(messageHistory, prompt)
    console.log("Groq API result:", result)

    const score = parseInt(result)
    if (isNaN(score) || score < 1 || score > 10) {
      throw new Error(`Invalid score returned from API: ${result}`)
    }

    return NextResponse.json({ score })
  } catch (error) {
    console.error("Groq API error:", error)

    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
