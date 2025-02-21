// src/components/grid/filters/BotFilter.tsx
"use client"

import React from "react"
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

  // Early return if we have loaded exactly one bot option
  if (botOptions.length === 1) {
    // If we determine there's just one bot, don't show the dropdown and make sure
    // the selected bot is set correctly
    if (selectedBotId !== botOptions[0].bot_id) {
      // This is a side effect in render, but safe here as it only runs once
      // per component when we find we have a single bot
      setTimeout(() => onBotChange(botOptions[0].bot_id), 0)
    }
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

  // If we ended up with just one bot after filtering, don't show the dropdown
  if (filteredBotOptions.length === 1) {
    if (selectedBotId !== filteredBotOptions[0].bot_id) {
      setTimeout(() => onBotChange(filteredBotOptions[0].bot_id), 0)
    }
    return null
  }

  // If the selected bot isn't in the filtered options and isn't "all", reset to "all"
  if (
    selectedBotId !== "all" &&
    !filteredBotOptions.some(bot => bot.bot_id === selectedBotId)
  ) {
    setTimeout(() => onBotChange("all"), 0)
  }

  // Only show the dropdown if we have more than one bot option
  return (
    <Select
      value={selectedBotId}
      onChange={e => onBotChange(e.target.value)}
      sx={{ minWidth: 200 }}
      disabled={filteredBotOptions.length === 0}
    >
      <MenuItem value="all">All Assigned Bots</MenuItem>
      {filteredBotOptions.map(bot => (
        <MenuItem key={bot.bot_id} value={bot.bot_id}>
          {bot.bot_name || bot.bot_id}
        </MenuItem>
      ))}
    </Select>
  )
}
