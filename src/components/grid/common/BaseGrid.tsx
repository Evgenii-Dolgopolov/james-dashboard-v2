// src/components/grid/common/BaseGrid.tsx
"use client"
import React, { useState, useEffect } from "react"
import { Box, Alert, AlertTitle } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Toolbar } from "./Toolbar"
import { filterRowsByTime } from "@/utils/filters"
import { LoadingState, ErrorState, EmptyState } from "./States"
import { FilterContainer } from "../filters/FilterContainer"
import { useSession } from "next-auth/react"
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
  threadFilter?: string
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
  threadFilter,
}) => {
  const { data: session, status } = useSession()
  const [state, setState] = useState<BaseGridState>({
    ...initialState,
    threadFilter,
  })

  useEffect(() => {
    const loadBotOptions = async () => {
      if (status !== "authenticated" || !session?.user?.id) {
        console.log("Session not ready for bot options")
        return
      }
      try {
        const bots = await fetchBotNames(session.user.id)
        if (bots.length > 0) {
          console.log("Loaded bot options:", bots)
          setState(prev => ({
            ...prev,
            botOptions: bots,
            selectedBotId: "all", // Set to 'all' by default
          }))
        }
      } catch (err) {
        console.log("Error loading bot options:", err)
      }
    }
    loadBotOptions()
  }, [session?.user?.id, status])

  useEffect(() => {
    const loadMessages = async () => {
      if (status !== "authenticated" || !session?.user?.id) {
        console.log("Session not ready for messages")
        return
      }
      setState(prev => ({ ...prev, loading: true }))
      try {
        const data = await fetchChatbotMessages(
          session.user.id,
          state.selectedBotId,
        )
        setState(prev => ({
          ...prev,
          messages: data,
          loading: false,
          error: null,
        }))
      } catch (err) {
        console.log("Error loading messages:", err)
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to load messages",
          loading: false,
        }))
      }
    }
    loadMessages()
  }, [session?.user?.id, status, state.selectedBotId])

  useEffect(() => {
    if (state.messages) {
      console.log("Formatting messages with options:", {
        messageThreads: Object.keys(state.messages).length,
        botOptions: state.botOptions.length,
      })
      const formattedMessages = formatMessages(state.messages, state.botOptions)
      setState(prev => ({ ...prev, rows: formattedMessages }))
    }
  }, [state.messages, state.botOptions, formatMessages])

  const handleTimeFilterChange = (newTimeFilter: string) => {
    setState(prev => ({ ...prev, timeFilter: newTimeFilter }))
  }

  const handleBotChange = (newBotId: string) => {
    setState(prev => ({ ...prev, selectedBotId: newBotId }))
  }

  const handleRowModesModelChange = (newModel: Record<string, any>) => {
    setState(prev => ({ ...prev, rowModesModel: newModel }))
  }

  const filteredRows = filterRowsByTime(state.rows, state.timeFilter)

  if (status === "loading" || state.loading) {
    return <LoadingState />
  }

  if (!session?.user?.botAssignments?.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          <AlertTitle>No Access</AlertTitle>
          You don't have any bots assigned to your account. Please contact your
          administrator.
        </Alert>
      </Box>
    )
  }

  if (state.error) {
    return <ErrorState error={state.error} />
  }

  const renderGridContent = () => {
    if (!state.messages || filteredRows.length === 0) {
      return (
        <>
          <Box sx={{ mb: 2 }}>
            <FilterContainer
              timeFilter={state.timeFilter}
              selectedBotId={state.selectedBotId}
              onTimeFilterChange={handleTimeFilterChange}
              onBotChange={handleBotChange}
              botOptions={state.botOptions}
            />
          </Box>
          <EmptyState filtered={!!state.selectedBotId || !!threadFilter} />
        </>
      )
    }
    return (
      <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          editMode="row"
          rowModesModel={state.rowModesModel}
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
                  timeFilter={state.timeFilter}
                  selectedBotId={state.selectedBotId}
                  onTimeFilterChange={handleTimeFilterChange}
                  onBotChange={handleBotChange}
                  botOptions={state.botOptions}
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
