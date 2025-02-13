// src/components/grid/common/BaseGrid.tsx
"use client"
import React, { useState, useEffect } from "react"
import { Box } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Toolbar } from "./Toolbar"
import { filterRowsByTime } from "@/utils/filters"
import { LoadingState, ErrorState, EmptyState } from "./States"
import { FilterContainer } from "../filters/FilterContainer"
import {
  fetchChatbotMessages,
  fetchBotNames,
  type Message,
  type Bot,
} from "@/lib/supabase/queries"

type BaseGridProps = {
  columns: any[]
  formatMessages: (
    messages: Record<string, Message[]>,
    botOptions: Bot[],
  ) => (Message & { threadMessages?: Message[] })[]
}

type BaseGridState = {
  messages: Record<string, Message[]> | null
  loading: boolean
  error: string | null
  rows: Message[]
  rowModesModel: Record<string, any>
  timeFilter: string
  selectedBotId: string
  botOptions: Bot[]
  threadFilter?: string
}

const initialState: BaseGridState = {
  messages: null,
  loading: true,
  error: null,
  rows: [],
  rowModesModel: {},
  timeFilter: "all",
  selectedBotId: "all",
  botOptions: [],
  threadFilter: undefined,
}

export const BaseGrid: React.FC<BaseGridProps> = ({
  columns,
  formatMessages,
}) => {
  const [state, setState] = useState<BaseGridState>(initialState)
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

  useEffect(() => {
    if (messages) {
      const formattedMessages = formatMessages(messages, botOptions)
      setState(prev => ({ ...prev, rows: formattedMessages }))
    }
  }, [messages, botOptions, formatMessages])

  const handleTimeFilterChange = (newTimeFilter: string) => {
    setState(prev => ({ ...prev, timeFilter: newTimeFilter }))
  }

  const handleBotChange = (newBotId: string) => {
    setState(prev => ({ ...prev, selectedBotId: newBotId }))
  }

  const handleRowModesModelChange = (newModel: Record<string, any>) => {
    setState(prev => ({ ...prev, rowModesModel: newModel }))
  }

  const filteredRows = filterRowsByTime(rows, timeFilter)

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />

  const renderGridContent = () => {
    if (!messages || filteredRows.length === 0) {
      return (
        <>
          <Box sx={{ mb: 2 }}>
            <FilterContainer
              timeFilter={timeFilter}
              selectedBotId={selectedBotId}
              onTimeFilterChange={handleTimeFilterChange}
              onBotChange={handleBotChange}
            />
          </Box>
          <EmptyState filtered={!!selectedBotId || !!state.threadFilter} />
        </>
      )
    }

    return (
      <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          autoHeight={false}
          initialState={{
            columns: {
              columnVisibilityModel: {
                user_name: false,
                user_phone: false,
                user_company: false,
                user_callback_message: false,
              },
            },
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          slots={{
            toolbar: () => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1,
                  width: "100%",
                }}
              >
                <FilterContainer
                  timeFilter={timeFilter}
                  selectedBotId={selectedBotId}
                  onTimeFilterChange={handleTimeFilterChange}
                  onBotChange={handleBotChange}
                />
                <Toolbar />
              </Box>
            ),
          }}
        />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)",
        width: "95%",
        margin: "0 auto",
      }}
    >
      {renderGridContent()}
    </Box>
  )
}
