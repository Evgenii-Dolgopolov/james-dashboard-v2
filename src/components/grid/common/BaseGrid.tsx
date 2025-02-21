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
import { useFilterContext } from "@/context/filter/FilterContext"
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
  botOptions: Bot[]
  threadFilter?: string
}

const initialState: BaseGridState = {
  messages: null,
  loading: true,
  error: null,
  rows: [],
  rowModesModel: {},
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

  // Get filter state from context
  const { timeFilter, selectedBotId, setBotFilter } = useFilterContext()

  // Load bot options first, separately from messages
  useEffect(() => {
    const loadBotOptions = async () => {
      if (status !== "authenticated" || !session?.user?.id) {

        return
      }
      try {
        const bots = await fetchBotNames(session.user.id)
        setState(prev => ({
          ...prev,
          botOptions: bots,
        }))

        // If there's only one bot, automatically select it
        if (bots.length === 1 && selectedBotId === "all") {
          setBotFilter(bots[0].bot_id)
        }
      } catch (err) {
        console.log("Error loading bot options:", err)
      }
    }
    loadBotOptions()
  }, [session?.user?.id, status, selectedBotId, setBotFilter])

  // Load messages after bot options are loaded
  useEffect(() => {
    const loadMessages = async () => {
      if (status !== "authenticated" || !session?.user?.id) {

        return
      }
      setState(prev => ({ ...prev, loading: true }))
      try {
        const data = await fetchChatbotMessages(session.user.id, selectedBotId)
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
  }, [session?.user?.id, status, selectedBotId])

  useEffect(() => {
    if (state.messages) {
      
      const formattedMessages = formatMessages(state.messages, state.botOptions)
      setState(prev => ({ ...prev, rows: formattedMessages }))
    }
  }, [state.messages, state.botOptions, formatMessages])

  const handleRowModesModelChange = (newModel: Record<string, any>) => {
    setState(prev => ({ ...prev, rowModesModel: newModel }))
  }

  const filteredRows = filterRowsByTime(state.rows, timeFilter)

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
            <FilterContainer botOptions={state.botOptions} />
          </Box>
          <EmptyState filtered={!!selectedBotId || !!threadFilter} />
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
              paginationModel: { pageSize: 100, page: 0 },
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
                <FilterContainer botOptions={state.botOptions} />
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
