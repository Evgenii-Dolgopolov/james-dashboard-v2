// src/app/api/sentiment/update/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { threadId, score, justification, messageHistory } = body
    console.log("BODY:", messageHistory)

    if (!threadId || score === undefined || score === null) {
      return NextResponse.json(
        { error: "Thread ID and score are required" },
        { status: 400 },
      )
    }

    // Parse score to ensure it's a number
    const scoreNum = typeof score === "string" ? parseInt(score, 10) : score

    if (isNaN(scoreNum)) {
      return NextResponse.json(
        { error: "Score must be a valid number" },
        { status: 400 },
      )
    }

    // Fetch all messages for the thread, sorted by date (ascending)
    const { data: messages, error: fetchError } = await supabaseAdmin
      .from("chatbot")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true }) // Sort by date to get the first message

    if (fetchError) {
      console.error("Error fetching messages for thread:", fetchError)
      return NextResponse.json(
        { error: "Failed to fetch messages for thread" },
        { status: 500 },
      )
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages found for the thread" },
        { status: 404 },
      )
    }

    // Get the first message (index 0)
    const firstMessage = messages[0]

    // Update the first message with sentiment analysis and chat history
    const { data: updatedMessage, error: updateError } = await supabaseAdmin
      .from("chatbot")
      .update({
        sentiment_analysis: scoreNum, // Save sentiment score
        sentiment_analysis_justification: justification || "", // Save justification
        chat_history: messageHistory || "", // Save chat history in the first message
      })
      .eq("id", firstMessage.id) // Update only the first message

    if (updateError) {
      console.error("Error updating first message in database:", updateError)
      return NextResponse.json(
        { error: "Failed to update first message" },
        { status: 500 },
      )
    }

    // Return success response
    return NextResponse.json({
      success: true,
      updated: updatedMessage,
    })
  } catch (error) {
    console.error("Error in update sentiment API:", error)
    return NextResponse.json(
      {
        error: "Failed to update sentiment data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
