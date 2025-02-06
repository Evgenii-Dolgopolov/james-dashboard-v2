"use client"

import React, { useState, useEffect } from "react"
import { Box } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { MessagesColumns } from "./MessagesColumns"
import { Toolbar } from "./Toolbar"
import { formatDate } from "@/utils/formatters"
import { filterRowsByTime } from "@/utils/filters"
import { LoadingState, ErrorState, EmptyState } from "./States"
import {
  fetchChatbotMessages,
  fetchBotNames,
  type Message,
  type Bot,
} from "@/lib/supabase/queries"
import { FilterContainer } from "./FilterContainer"

type MessagesState = {
  messages: Record<string, Message[]> | null
  loading: boolean
  error: string | null
  rows: Message[]
  rowModesModel: Record<string, any>
  timeFilter: string
  selectedBotId: string
  botOptions: Bot[]
}

const initialState: MessagesState = {
  messages: null,
  loading: true,
  error: null,
  rows: [],
  rowModesModel: {},
  timeFilter: "all",
  selectedBotId: "all",
  botOptions: [],
}

const MessagesGrid = () => {
  const [state, setState] = useState<MessagesState>(initialState)
  const {
    messages,
    loading,
    error,
    rows,
    rowModesModel,
    timeFilter,
    selectedBotId,
    botOptions,
  } = state

  // Fetch bot options
  useEffect(() => {
    const loadBotOptions = async () => {
      try {
        const bots = await fetchBotNames()
        setState(prev => ({ ...prev, botOptions: bots }))
      } catch (err) {
        console.error("Failed to load bots:", err)
      }
    }
    loadBotOptions()
  }, [])

  // Fetch messages based on selected bot
  useEffect(() => {
    const loadMessages = async () => {
      setState(prev => ({ ...prev, loading: true }))
      try {
        const data = await fetchChatbotMessages(
          selectedBotId === "all" ? undefined : selectedBotId,
        )
        setState(prev => ({
          ...prev,
          messages: data,
          error: null,
          loading: false,
        }))
      } catch (err) {
        console.error("Failed to load messages:", err)
        setState(prev => ({
          ...prev,
          error: "Failed to load messages",
          loading: false,
        }))
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
          // Map bot_id to bot_name using botOptions
          bot_name:
            botOptions.find(b => b.bot_id === message.bot_id)?.bot_name ||
            message.bot_id,
        }))
      setState(prev => ({ ...prev, rows: formattedMessages }))
    }
  }, [messages, botOptions]) // Added botOptions to dependencies

  // Handler functions
  const handleTimeFilterChange = (newTimeFilter: string) => {
    setState(prev => ({ ...prev, timeFilter: newTimeFilter }))
  }

  const handleBotChange = (newBotId: string) => {
    setState(prev => ({ ...prev, selectedBotId: newBotId }))
  }

  const handleRowModesModelChange = (newModel: Record<string, any>) => {
    setState(prev => ({ ...prev, rowModesModel: newModel }))
  }

  // Filter logic
  const filteredRows = filterRowsByTime(rows, timeFilter)

  // Render states
  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!messages || Object.keys(messages).length === 0) return <EmptyState />

  return (
    <Box sx={{ height: "auto", minHeight: 500, width: "95%" }}>
      <FilterContainer
        timeFilter={timeFilter}
        selectedBotId={selectedBotId}
        onTimeFilterChange={handleTimeFilterChange}
        onBotChange={handleBotChange}
      />

      <DataGrid
        rows={filteredRows}
        columns={MessagesColumns()}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        slots={{ toolbar: Toolbar }}
      />
    </Box>
  )
}

export default MessagesGrid
