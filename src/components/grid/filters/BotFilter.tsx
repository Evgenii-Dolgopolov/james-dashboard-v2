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

  // Handle single bot case with useEffect instead of during render
  useEffect(() => {
    // If we determine there's just one bot, make sure the selected bot is set correctly
    if (botOptions.length === 1 && selectedBotId !== botOptions[0].bot_id) {
      onBotChange(botOptions[0].bot_id)
    }

    // If the selected bot isn't in the filtered options and isn't "all", reset to "all"
    const filteredOptions = botOptions.filter(bot =>
      assignedBotIds.includes(bot.bot_id),
    )
    if (
      selectedBotId !== "all" &&
      filteredOptions.length > 0 &&
      !filteredOptions.some(bot => bot.bot_id === selectedBotId)
    ) {
      onBotChange("all")
    }
  }, [botOptions, selectedBotId, assignedBotIds, onBotChange])

  // Early return if we have loaded exactly one bot option
  if (botOptions.length === 1) {
    return null
  }

  // Show loading state only if we're still determining the bot options
  if (botOptions.length === 0 && status === "loading") {
    return <CircularProgress size={24} />
  }

  // If user has no bot assignments
  if (!assignedBotIds.length) {
    return (
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="body2" color="text.secondary">
          No bots assigned
        </Typography>
      </Box>
    )
  }

  // Filter the bot options by the user's assignments
  const filteredBotOptions = botOptions.filter(bot =>
    assignedBotIds.includes(bot.bot_id),
  )

  // Sort the filtered options alphabetically by bot_name
  const sortedBotOptions = [...filteredBotOptions].sort((a, b) => {
    // Use bot_name if available, otherwise fallback to bot_id
    const nameA = (a.bot_name || a.bot_id).toLowerCase()
    const nameB = (b.bot_name || b.bot_id).toLowerCase()
    return nameA.localeCompare(nameB)
  })

  // If we ended up with just one bot after filtering, don't show the dropdown
  if (sortedBotOptions.length === 1) {
    return null
  }

  // Only show the dropdown if we have more than one bot option
  return (
    <Select
      value={selectedBotId}
      onChange={e => onBotChange(e.target.value)}
      sx={{ minWidth: 200 }}
      disabled={sortedBotOptions.length === 0}
    >
      <MenuItem value="all">All Assigned Bots</MenuItem>
      {sortedBotOptions.map(bot => (
        <MenuItem key={bot.bot_id} value={bot.bot_id}>
          {bot.bot_name || bot.bot_id}
        </MenuItem>
      ))}
    </Select>
  )
}
