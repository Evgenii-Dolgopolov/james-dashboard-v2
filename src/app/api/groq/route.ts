// src/app/api/groq/route.ts
import { groqSentimentAnalysis } from "@/lib/groq/queries"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { messageHistory, prompt } = body

    if (!messageHistory || !prompt) {
      return NextResponse.json(
        { error: "Message history and prompt are required" },
        { status: 400 },
      )
    }

    // Get the raw JSON string from Groq
    const resultJson = await groqSentimentAnalysis(messageHistory, prompt)

    // Parse the JSON response from the LLM
    try {
      // First try to parse it as-is (if it's already valid JSON)
      let parsedResult
      try {
        parsedResult = JSON.parse(resultJson)
      } catch (e) {
        // If that fails, try to extract JSON from the text
        const jsonRegex = /{[\s\S]*}/gm
        const match = jsonRegex.exec(resultJson)
        if (match) {
          parsedResult = JSON.parse(match[0])
        } else {
          throw new Error("Could not parse JSON from LLM response")
        }
      }

      // Validate that we have the expected fields
      if (!parsedResult.score) {
        throw new Error("LLM response missing required 'score' field")
      }

      // Convert score to a number if it's a string
      const scoreNum =
        typeof parsedResult.score === "string"
          ? parseInt(parsedResult.score, 10)
          : parsedResult.score

      // Validate score is within expected range
      if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 100) {
        console.error("Invalid score value:", scoreNum)
        throw new Error(
          `Score must be a number between 1-100, got: ${scoreNum}`,
        )
      }

      return NextResponse.json({
        score: scoreNum,
        justification: parsedResult.justification || "",
      })
    } catch (parseError) {
      console.error(
        "Error parsing LLM response:",
        parseError,
        "Raw response:",
        resultJson,
      )
      throw new Error(`Failed to parse LLM response: ${parseError.message}`)
    }
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
