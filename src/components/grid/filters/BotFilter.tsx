// src/components/grid/filters/BotFilter.tsx
"use client"
import React, { useEffect } from "react"
import {
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material"
import { useSession } from "next-auth/react"
import { type Bot } from "@/lib/supabase/queries"

type BotFilterProps = {
  selectedBotId: string
  onBotChange: (value: string) => void
  botOptions: Bot[]
}

export const BotFilter: React.FC<BotFilterProps> = ({
  selectedBotId,
  onBotChange,
  botOptions,
}) => {
  const { data: session, status } = useSession()
  const assignedBotIds = session?.user?.botAssignments || []

  useEffect(() => {
    if (status === "loading") return

    if (
      status === "authenticated" &&
      assignedBotIds.length &&
      !botOptions.length
    ) {
      console.error("Session authenticated but no bot options available:", {
        assignedBotIds,
        botOptions,
      })
    }
  }, [status, assignedBotIds, botOptions])

  if (status === "loading") return <CircularProgress size={24} />

  if (!assignedBotIds.length) {
    return (
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="body2" color="text.secondary">
          No bots assigned
        </Typography>
      </Box>
    )
  }

  const filteredBotOptions = botOptions.filter(bot =>
    assignedBotIds.includes(bot.bot_id),
  )

  // Reset to "all" if current selection is invalid
  if (selectedBotId !== "all" && !assignedBotIds.includes(selectedBotId)) {
    onBotChange("all")
  }

  return (
    <Select
      value={selectedBotId}
      onChange={e => onBotChange(e.target.value)}
      sx={{ minWidth: 200 }}
      disabled={!filteredBotOptions.length}
    >
      <MenuItem value="all">All Assigned Bots</MenuItem>
      {filteredBotOptions.map(bot => (
        <MenuItem key={bot.bot_id} value={bot.bot_id}>
          {bot.bot_name}
        </MenuItem>
      ))}
    </Select>
  )
}
