"use client"

import React, { useState, useEffect } from "react"
import { Box } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { MessagesColumns } from "./MessagesColumns"
import { Toolbar } from "./Toolbar"
import { formatDate, filterRowsByTime } from "@/utils/utils"
import { LoadingState, ErrorState, EmptyState } from "./States"
import { fetchChatbotMessages } from "@/services/fetchChatbotMessages"
import { FilterContainer } from "./FilterContainer"

type Message = {
  id: string
  created_at: string
  bot_id: string
  bot_name: string
  thread_id: string
  user_message: string
  bot_message: string
  user_email: string
  suggested_question: string
}

const MessagesGrid = () => {
  const [messages, setMessages] = useState<Record<string, Message[]> | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<Message[]>([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [timeFilter, setTimeFilter] = useState("all")
  const [selectedBotId, setSelectedBotId] = useState<string>("all")

  // Fetch messages based on selected bot
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true)
      try {
        const data = await fetchChatbotMessages(
          selectedBotId === "all" ? undefined : selectedBotId,
        )
        setMessages(data)
        setError(null)
      } catch (err) {
        console.error("Failed to load messages:", err)
        setError("Failed to load messages")
      } finally {
        setLoading(false)
      }
    }
    loadMessages()
  }, [selectedBotId])

  // Format messages into rows
  useEffect(() => {
    if (messages) {
      const formattedMessages = Object.values(messages)
        .flat()
        .map((message: Message) => ({
          ...message,
          created_at: formatDate(message.created_at),
          bot_name: message.bot_id,
        }))
      setRows(formattedMessages)
    }
  }, [messages])

  // Filter logic
  const filteredRows = filterRowsByTime(rows, timeFilter)

  // Render states
  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!messages || messages.length === 0) return <EmptyState />

  return (
    <Box sx={{ height: "auto", minHeight: 500, width: "95%" }}>
      <FilterContainer
        timeFilter={timeFilter}
        selectedBotId={selectedBotId}
        onTimeFilterChange={setTimeFilter}
        onBotChange={setSelectedBotId}
      />

      <DataGrid
        rows={filteredRows}
        columns={MessagesColumns()}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        slots={{ toolbar: Toolbar }}
      />
    </Box>
  )
}

export default MessagesGrid
