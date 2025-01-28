"use client"

import React, { useState, useEffect } from "react"
import { Box, MenuItem, Select, Typography } from "@mui/material"
import {
  DataGrid,
  GridRowEditStopReasons,
  // GridRowModes,
} from "@mui/x-data-grid"
import { DataColumns } from "./DataColumns"
import { CustomToolbar } from "./CustomToolbar"
import { useChatbotMessages } from "../../../hooks/useChatbotMessages"
import { formatDate } from "../../../utils/utils"

const UserDataGrid = () => {
  const { messages, loading, error } = useChatbotMessages()
  const [rows, setRows] = useState<any[]>([]) // Initialize rows as an empty array
  const [rowModesModel, setRowModesModel] = useState({}) // Define rowModesModel state
  const [timeFilter, setTimeFilter] = useState("all") // State for time filter

  // Format the messages and update rows when messages change
  useEffect(() => {
    if (messages) {
      const formattedMessages = messages.map((message: any) => ({
        ...message,
        created_at: formatDate(message.created_at), // Format the created_at field
      }))
      setRows(formattedMessages)
    }
  }, [messages])

  // Handle time filter change
  const handleTimeFilterChange = (event: any) => {
    setTimeFilter(event.target.value)
  }

  // Filter rows based on the selected time filter
  const filteredRows = rows.filter((row: any) => {
    const rowDate = new Date(row.created_at)
    const now = new Date()

    switch (timeFilter) {
      case "today":
        return rowDate.toDateString() === now.toDateString()
      case "thisWeek":
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        return rowDate >= startOfWeek
      case "last30Days":
        const startOf30Days = new Date(now.setDate(now.getDate() - 30))
        return rowDate >= startOf30Days
      default:
        return true // Show all rows if no filter is selected
    }
  })

  // Handle row edit stop
  const handleRowEditStop = (params: any, event: any) => {
    try {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true
      }
    } catch (error) {
      console.error("Error in row edit stop handler:", error)
    }
  }

  // Handle edit click
  // const handleEditClick = (id: any) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  // }

  // Handle save click
  // const handleSaveClick = (id: any) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  // }

  // Handle delete click
  // const handleDeleteClick = (id: any) => () => {
  //   setRows(rows.filter((row: any) => row.id !== id))
  // }

  // Handle cancel click
  // const handleCancelClick = (id: any) => () => {
  //   setRowModesModel({
  //     ...rowModesModel,
  //     [id]: { mode: GridRowModes.View, ignoreModifications: true },
  //   })
  //   const editedRow = rows.find((row: any) => row.id === id)
  //   if ((editedRow as any)?.isNew) {
  //     setRows(rows.filter((row: any) => row.id !== id))
  //   }
  // }

  // Process row updates
  const processRowUpdate = (newRow: any) => {
    const updatedMessages = rows.map(row =>
      row.id === newRow.id ? newRow : row,
    )
    setRows(updatedMessages) // Update local state
    return newRow
  }

  // Define columns using DataColumns
  const columns = DataColumns(
    // rowModesModel,
    // handleSaveClick,
    // handleCancelClick,
    // handleEditClick,
    // handleDeleteClick,
  )

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          height: 500,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          height: 500,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    )
  }

  // Empty state
  if (!messages || messages.length === 0) {
    return (
      <Box
        sx={{
          height: 500,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">No messages found</Typography>
      </Box>
    )
  }

  // Render the DataGrid
  return (
    <Box
      sx={{
        height: "auto",
        minHeight: 500,
        width: "98%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      {/* Time Filter Dropdown */}
      <Box sx={{ marginBottom: 2 }}>
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
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    </Box>
  )
}

export default UserDataGrid
