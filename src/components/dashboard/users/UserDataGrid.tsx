"use client"

import React, { useState, useEffect } from "react"
import { Box, MenuItem, Select } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { DataColumns } from "./DataColumns"
import { CustomToolbar } from "./CustomToolbar"
import { useChatbotMessages } from "../../../hooks/useChatbotMessages"
import { formatDate, filterRowsByTime } from "../../../utils/utils"
import { LoadingState, ErrorState, EmptyState } from "./DataGridStates"
import { fetchBotNames, fetchChatbotMessages } from "../../../services/fetchChatbotMessages"

const UserDataGrid = () => {
  const [messages, setMessages] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [timeFilter, setTimeFilter] = useState("all")
  const [botOptions, setBotOptions] = useState<{name: string, id: string}[]>([])
  const [selectedBotId, setSelectedBotId] = useState<string>("all")

  // Fetch bot options
  useEffect(() => {
    const loadBotOptions = async () => {
      try {
        const bots = await fetchBotNames()
        setBotOptions(bots.map(b => ({ name: b.bot_name, id: b.bot_id })))
      } catch (err) {
        console.error("Failed to load bots:", err)
      }
    }
    loadBotOptions()
  }, [])

  // Fetch messages based on selected bot
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true)
      try {
        const data = await fetchChatbotMessages(selectedBotId === "all" ? undefined : selectedBotId)
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
        .map((message: any) => ({
          ...message,
          created_at: formatDate(message.created_at),
          // Map bot_id to bot_name using our botOptions
          bot_name: botOptions.find(b => b.id === message.bot_id)?.name || message.bot_id
        }))
      setRows(formattedMessages)
    }
  }, [messages, botOptions])

  // Filter logic
  const filteredRows = filterRowsByTime(rows, timeFilter)

  // Render states
  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!messages || messages.length === 0) return <EmptyState />

  return (
    <Box sx={{ height: "auto", minHeight: 500, width: "95%" }}>
      {/* Filter Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="thisWeek">Last 7 Days</MenuItem>
          <MenuItem value="last30Days">Last 30 Days</MenuItem>
        </Select>

        <Select
          value={selectedBotId}
          onChange={(e) => setSelectedBotId(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Bots</MenuItem>
          {botOptions.map((bot) => (
            <MenuItem key={bot.id} value={bot.id}>
              {bot.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Data Grid */}
      <DataGrid
        rows={filteredRows}
        columns={DataColumns()}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        slots={{ toolbar: CustomToolbar }}
      />
    </Box>
  )
}

export default UserDataGrid