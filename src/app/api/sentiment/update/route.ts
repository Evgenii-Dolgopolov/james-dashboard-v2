// src/app/api/sentiment/update/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Update sentiment API received body:", body)

    const { threadId, score, justification } = body

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

    // Log the current values before update
    const { data: beforeData, error: beforeError } = await supabaseAdmin
      .from("chatbot")
      .select("thread_id, sentiment_analysis, sentiment_analysis_justification")
      .eq("thread_id", threadId)
      .limit(5)

    console.log("Current database values:", {
      error: beforeError?.message || null,
      data: beforeData,
    })

    // Update all records with matching thread_id
    const { data, error } = await supabaseAdmin
      .from("chatbot")
      .update({
        sentiment_analysis: scoreNum,
        sentiment_analysis_justification: justification || "",
      })
      .eq("thread_id", threadId)

    if (error) {
      console.error("Error updating sentiment in database:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Verify the update was successful
    const { data: afterData, error: afterError } = await supabaseAdmin
      .from("chatbot")
      .select("thread_id, sentiment_analysis, sentiment_analysis_justification")
      .eq("thread_id", threadId)
      .limit(5)

    console.log("Database values after update:", {
      error: afterError?.message || null,
      data: afterData,
    })

    return NextResponse.json({
      success: true,
      updated: afterData,
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
