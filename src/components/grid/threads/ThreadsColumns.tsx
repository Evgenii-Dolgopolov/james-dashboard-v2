// src/components/grid/threads/ThreadsColumns.tsx
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { GridRenderCellParams, GridColDef } from "@mui/x-data-grid"
import { Tooltip } from "@mui/material"
import { analyzeSentiment } from "@/services/sentiment/analyze"
import { useChatbotMessages } from "@/hooks/useChatbotMessages"
import { fetchSentimentPrompt } from "@/lib/supabase/queries"
import Button from "../common/Button"
import type { Message } from "@/lib/supabase/queries"

type ThreadRow = Message & {
  threadMessages: Message[]
  duration: string
  totalMessages: number
  chat_history: string
  prompt: string | null
}

export const ThreadsColumns = (): GridColDef<ThreadRow>[] => {
  const router = useRouter()
  const { messages } = useChatbotMessages()
  const [loadingThreads, setLoadingThreads] = useState<Record<string, boolean>>(
    {},
  )

  const isValidChatHistory = (history: string | null | undefined): boolean => {
    return !!history && history.trim().length > 0
  }

  const handleSentimentAnalysis = useCallback(
    async (params: GridRenderCellParams<ThreadRow>) => {
      const threadId = params.row.thread_id
      const botId = params.row.bot_id

      try {
        setLoadingThreads(prev => ({ ...prev, [threadId]: true }))
        const threadMessages = messages[threadId]

        if (
          !threadMessages ||
          !threadMessages.length ||
          !isValidChatHistory(threadMessages[0].chat_history)
        ) {
          console.error("Missing valid chat history for thread:", threadId)
          setLoadingThreads(prev => ({ ...prev, [threadId]: false }))
          return
        }

        // Fetch the sentiment prompt from client_table based on the bot ID
        const sentimentPrompt = await fetchSentimentPrompt(botId)

        if (!sentimentPrompt) {
          console.error("No sentiment prompt found for bot ID:", botId)
          setLoadingThreads(prev => ({ ...prev, [threadId]: false }))
          return
        }

        console.log("Sentiment analysis request data:", {
          threadId,
          botId,
          hasHistory: !!threadMessages[0].chat_history,
          promptFound: !!sentimentPrompt,
        })

        const { success } = await analyzeSentiment({
          threadId,
          messageHistory: threadMessages[0].chat_history || "",
          prompt: sentimentPrompt,
        })

        if (success) {
          window.location.reload()
        }
      } catch (error) {
        console.error("Error analyzing sentiment:", error)
      } finally {
        setLoadingThreads(prev => ({ ...prev, [threadId]: false }))
      }
    },
    [messages],
  )

  return [
    {
      field: "created_at",
      headerName: "Time",
      flex: 1,
      minWidth: 165,
      editable: false,
    },
    {
      field: "bot_name",
      headerName: "Bot Name",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "thread_id",
      headerName: "Thread ID",
      flex: 1,
      minWidth: 100,
      editable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams<ThreadRow, string>) => {
        return (
          <div
            className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
            onClick={() =>
              router.push(`/dashboard/messages?thread=${params.value}`)
            }
          >
            {params.value}
          </div>
        )
      },
    },
    {
      field: "totalMessages",
      headerName: "Number of Messages",
      flex: 1,
      minWidth: 150,
      editable: false,
      type: "number",
      align: "right",
      headerAlign: "right",
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      minWidth: 80,
      editable: false,
      sortable: true,
      renderCell: (params: GridRenderCellParams<ThreadRow>) => {
        try {
          const duration = params.row.duration || "00:00:00"
          return (
            <div style={{ textAlign: "right", width: "100%" }}>{duration}</div>
          )
        } catch (error) {
          console.error("Error in duration renderCell:", error)
          return (
            <div style={{ textAlign: "right", width: "100%" }}>00:00:00</div>
          )
        }
      },
      sortComparator: (v1: string, v2: string) => {
        const toSeconds = (duration: string) => {
          try {
            if (!duration) return 0
            const parts = duration.split(":").reverse()
            const [seconds, minutes, hours] = parts.map(part => {
              const num = parseInt(part, 10)
              return isNaN(num) ? 0 : num
            })
            return hours * 3600 + minutes * 60 + seconds
          } catch (error) {
            console.error("Error parsing duration:", error)
            return 0
          }
        }
        const seconds1 = toSeconds(v1)
        const seconds2 = toSeconds(v2)
        return seconds1 - seconds2
      },
      align: "right",
      headerAlign: "right",
    },
    {
      field: "user_email",
      headerName: "Callback",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "sentiment",
      headerName: "Sentiment",
      flex: 1,
      minWidth: 150,
      editable: false,
      renderCell: (params: GridRenderCellParams<ThreadRow>) => {
        const threadId = params.row.thread_id
        const isLoading = loadingThreads[threadId]
        const hasSentiment = params.row.sentiment_analysis !== null
        const hasValidHistory = isValidChatHistory(params.row.chat_history)

        if (isLoading) {
          return <div>Analyzing...</div>
        }
        if (hasSentiment) {
          return <div>{params.row.sentiment_analysis?.toFixed(0)}</div>
        }
        return (
          <Tooltip
            title={
              !hasValidHistory
                ? "There is no chat history for this conversation"
                : ""
            }
            placement="top"
            arrow
          >
            <span style={{ display: "inline-block" }}>
              <Button
                onClick={() => handleSentimentAnalysis(params)}
                disabled={isLoading || !hasValidHistory}
                className={
                  !hasValidHistory ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                Analyze sentiment
              </Button>
            </span>
          </Tooltip>
        )
      },
    },
  ]
}
