"use client"

import React, { useState, useEffect } from "react"
import { Box, MenuItem, Select } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { DataColumns } from "./DataColumns"
import { CustomToolbar } from "./CustomToolbar"
import { useChatbotMessages } from "../../../hooks/useChatbotMessages"
import { formatDate, filterRowsByTime } from "../../../utils/utils"
import { LoadingState, ErrorState, EmptyState } from "./DataGridStates"
import { fetchBotNames } from "../../../services/fetchChatbotMessages" // Import fetchBotNames

const UserDataGrid = () => {
  const { messages, loading, error } = useChatbotMessages()
  const [rows, setRows] = useState<any[]>([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [timeFilter, setTimeFilter] = useState("all")
  const [botNames, setBotNames] = useState<string[]>([]) // State for bot names
  const [botFilter, setBotFilter] = useState("all") // State for bot filter

  // Fetch bot names when the component mounts
  useEffect(() => {
    const loadBotNames = async () => {
      try {
        const names = await fetchBotNames() // Fetch bot names
        setBotNames(names)
      } catch (error) {
        console.error("Failed to load bot names:", error)
      }
    }

    loadBotNames()
  }, [])

  // Format the messages and update rows when messages change
  useEffect(() => {
    if (messages) {
      const formattedMessages = Object.values(messages)
        .flat()
        .map((message: any) => ({
          ...message,
          created_at: formatDate(message.created_at),
        }))

      setRows(formattedMessages)
    }
  }, [messages])

  // Handle time filter change
  const handleTimeFilterChange = (event: any) => {
    setTimeFilter(event.target.value)
  }

  // Handle bot filter change
  const handleBotFilterChange = (event: any) => {
    setBotFilter(event.target.value)
  }

  // Filter rows based on the selected time and bot filters
  const filteredRows = rows.filter((row: any) => {
    // Time filter logic
    const rowDate = new Date(row.created_at)
    const now = new Date()
    let timeCondition = true

    switch (timeFilter) {
      case "today":
        timeCondition = rowDate.toDateString() === now.toDateString()
        break
      case "thisWeek":
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - 7)
        timeCondition = rowDate >= startOfWeek
        break
      case "last30Days":
        const startOf30Days = new Date(now)
        startOf30Days.setDate(now.getDate() - 30)
        timeCondition = rowDate >= startOf30Days
        break
      default:
        timeCondition = true
    }

    // Bot filter logic
    const botCondition = botFilter === "all" || row.bot_name === botFilter

    return timeCondition && botCondition
  })

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!messages || messages.length === 0) {
    return <EmptyState />
  }

  // Render the DataGrid
  return (
    <Box
      sx={{
        height: "auto",
        minHeight: 500,
        width: "95%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      {/* Filter Dropdowns */}
      <Box sx={{ margin: 0, display: "flex", gap: 2, marginBottom: 2 }}>
        {/* Time Filter Dropdown */}
        <Select
          value={timeFilter}
          onChange={handleTimeFilterChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="thisWeek">This Week</MenuItem>
          <MenuItem value="last30Days">Last 30 Days</MenuItem>
        </Select>

        {/* Bot Filter Dropdown */}
        <Select
          value={botFilter}
          onChange={handleBotFilterChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Bots</MenuItem>
          {botNames.map(botName => (
            <MenuItem key={botName} value={botName}>
              {botName}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={filteredRows} // Use filtered rows
        columns={DataColumns()}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    </Box>
  )
}

export default UserDataGrid
