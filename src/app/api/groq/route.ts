// src/app/api/groq/route.ts
import { groqSentimentAnalysis } from "@/lib/groq/queries"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("API received body:", body)

    const { messageHistory, prompt } = body

    if (!messageHistory || !prompt) {
      console.log("Missing required fields:", {
        messageHistory: !!messageHistory,
        prompt: !!prompt,
      })
      return NextResponse.json(
        { error: "Message history and prompt are required" },
        { status: 400 },
      )
    }

    const result = await groqSentimentAnalysis(messageHistory, prompt)
    console.log("Groq API result:", result)

    const score = parseInt(result)

    if (isNaN(score) || score < 1 || score > 10) {
      throw new Error("Invalid score returned from API")
    }

    return NextResponse.json({ score })
  } catch (error) {
    console.error("Groq API error:", error)
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 },
    )
  }
}
