// src/components/grid/threads/ThreadsColumns.tsx
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { GridRenderCellParams, GridColDef } from "@mui/x-data-grid"
import {
  Tooltip,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { analyzeSentiment } from "@/services/sentiment/analyze"
import { useChatbotMessages } from "@/hooks/useChatbotMessages"
import {
  fetchSentimentPrompt,
  getThreadSentimentFromFirstMessage,
} from "@/lib/supabase/queries"
import Button from "../common/Button"
import type { Message } from "@/lib/supabase/queries"

type ThreadRow = Message & {
  threadMessages: Message[]
  duration: string
  totalMessages: number
  chat_history: string
  prompt: string | null
  sentiment_analysis_justification?: string | null
}

export const ThreadsColumns = (): GridColDef<ThreadRow>[] => {
  const router = useRouter()
  const { messages } = useChatbotMessages()
  const [loadingThreads, setLoadingThreads] = useState<Record<string, boolean>>(
    {},
  )
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>(
    {},
  )
  const [threadSentiments, setThreadSentiments] = useState<
    Record<
      string,
      {
        sentiment_analysis: number | null
        sentiment_analysis_justification: string | null
      }
    >
  >({})

  // Load initial sentiment data for threads
  useEffect(() => {
    const fetchInitialSentiments = async () => {
      const newSentiments: Record<string, any> = {}

      await Promise.all(
        Object.keys(messages).map(async threadId => {
          const sentimentData =
            await getThreadSentimentFromFirstMessage(threadId)
          newSentiments[threadId] = {
            sentiment_analysis: sentimentData.sentiment_analysis,
            sentiment_analysis_justification:
              sentimentData.sentiment_analysis_justification,
          }
        }),
      )

      setThreadSentiments(newSentiments)
    }

    if (messages && Object.keys(messages).length > 0) {
      fetchInitialSentiments()
    }
  }, [messages])

  // Close error message
  const handleCloseError = () => {
    setAnalysisError(null)
  }

  // Close success message
  const handleCloseSuccess = () => {
    setShowSuccessMessage(false)
  }

  const isValidChatHistory = (history: string | null | undefined): boolean => {
    return !!history && history.trim().length > 0
  }

  const handleSentimentAnalysis = useCallback(
    async (params: GridRenderCellParams<ThreadRow>) => {
      const threadId = params.row.thread_id
      const botId = params.row.bot_id

      try {
        setLoadingThreads(prev => ({ ...prev, [threadId]: true }))
        setAnalysisError(null)

        const threadMessages = messages[threadId]

        // Create complete chat history
        let threadChatHistory = threadMessages
          .map(item => item.chat_history)
          .filter(Boolean)
          .join("\n")

        if (
          !threadMessages ||
          !threadMessages.length ||
          !isValidChatHistory(threadChatHistory)
        ) {
          console.error("Missing valid chat history for thread:", threadId)
          setAnalysisError("No valid chat history found for this thread")
          setLoadingThreads(prev => ({ ...prev, [threadId]: false }))
          return
        }

        // Fetch the sentiment prompt from client_table based on the bot ID
        const sentimentPrompt = await fetchSentimentPrompt(botId)

        if (!sentimentPrompt) {
          console.error("No sentiment prompt found for bot ID:", botId)
          setAnalysisError(
            `No sentiment prompt configured for bot ID: ${botId}`,
          )
          setLoadingThreads(prev => ({ ...prev, [threadId]: false }))
          return
        }

        const result = await analyzeSentiment({
          threadId,
          messageHistory: threadChatHistory,
          prompt: sentimentPrompt,
        })

        if (result.success) {
          // Update both local results and thread sentiments
          setAnalysisResults(prev => ({
            ...prev,
            [threadId]: {
              score: result.score,
              justification: result.justification,
            },
          }))

          // Update thread sentiments to reflect new analysis
          setThreadSentiments(prev => ({
            ...prev,
            [threadId]: {
              sentiment_analysis: result.score,
              sentiment_analysis_justification: result.justification,
            },
          }))

          setShowSuccessMessage(true)

          setTimeout(() => {
            setLoadingThreads(prev => ({ ...prev, [threadId]: false }))
          }, 1000)
        } else {
          setAnalysisError(result.error || "Failed to analyze sentiment")
          setLoadingThreads(prev => ({ ...prev, [threadId]: false }))
        }
      } catch (error) {
        console.error("Error analyzing sentiment:", error)
        setAnalysisError(
          error instanceof Error ? error.message : "An unknown error occurred",
        )
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

        // Check analysis results first
        const localResult = analysisResults[threadId]

        // Then check fetched thread sentiment data
        const threadSentiment = threadSentiments[threadId] || {
          sentiment_analysis: null,
          sentiment_analysis_justification: null,
        }

        // Use local result if available, otherwise use thread sentiment data
        const hasSentiment =
          !!localResult || threadSentiment.sentiment_analysis !== null
        const sentimentScore =
          localResult?.score ?? threadSentiment.sentiment_analysis
        const justification =
          localResult?.justification ??
          threadSentiment.sentiment_analysis_justification

        const hasValidHistory = isValidChatHistory(params.row.chat_history)

        const containerStyles = {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }

        if (isLoading) {
          return (
            <Box sx={containerStyles}>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              <Typography variant="body2">Analyzing...</Typography>
            </Box>
          )
        }

        if (hasSentiment) {
          return (
            <Tooltip
              title={justification || "No justification provided"}
              placement="top"
              arrow
              sx={{ maxWidth: 500 }}
            >
              <Box sx={containerStyles}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ cursor: "help" }}
                >
                  {sentimentScore?.toFixed(0)}
                </Typography>
              </Box>
            </Tooltip>
          )
        }

        return (
          <>
            <Box sx={containerStyles}>
              <Tooltip
                title={
                  !hasValidHistory
                    ? "There is no chat history for this conversation"
                    : ""
                }
                placement="top"
                arrow
              >
                <span>
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
            </Box>

            <Snackbar
              open={!!analysisError}
              autoHideDuration={6000}
              onClose={handleCloseError}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseError}
                severity="error"
                sx={{ width: "100%" }}
              >
                {analysisError}
              </Alert>
            </Snackbar>

            <Snackbar
              open={showSuccessMessage}
              autoHideDuration={3000}
              onClose={handleCloseSuccess}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseSuccess}
                severity="success"
                sx={{ width: "100%" }}
              >
                Sentiment analysis completed successfully!
              </Alert>
            </Snackbar>
          </>
        )
      },
    },
  ]
}
