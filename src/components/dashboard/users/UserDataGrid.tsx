"use client"

import React, { useState, useEffect } from "react"
import { Box, MenuItem, Select } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { DataColumns } from "./DataColumns"
import { CustomToolbar } from "./CustomToolbar"
import { useChatbotMessages } from "../../../hooks/useChatbotMessages"
import { formatDate, filterRowsByTime } from "../../../utils/utils"
import { LoadingState, ErrorState, EmptyState } from "./DataGridStates"

const UserDataGrid = () => {
  const { messages, loading, error } = useChatbotMessages()
  const [rows, setRows] = useState<any[]>([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [timeFilter, setTimeFilter] = useState("all")

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

  // Filter rows based on the selected time filter
  const filteredRows = filterRowsByTime(rows, timeFilter)
  console.log(timeFilter)

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
      {/* Time Filter Dropdown */}
      <Box sx={{ margin: 0 }}>
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
      </Box>

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
