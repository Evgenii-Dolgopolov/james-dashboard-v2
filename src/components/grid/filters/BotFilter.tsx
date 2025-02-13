// src/components/grid/filters/BotFilter.tsx
import React, { useEffect, useState } from "react"
import { Select, MenuItem } from "@mui/material"
import { fetchBotNames, type Bot } from "@/lib/supabase/queries"

type BotFilterProps = {
  selectedBotId: string
  onBotChange: (value: string) => void
}

export const BotFilter: React.FC<BotFilterProps> = ({
  selectedBotId,
  onBotChange,
}) => {
  const [botOptions, setBotOptions] = useState<Bot[]>([])

  useEffect(() => {
    const loadBotOptions = async () => {
      try {
        const bots = await fetchBotNames()
        setBotOptions(bots)
      } catch (err) {
        console.error("Failed to load bots:", err)
      }
    }
    loadBotOptions()
  }, [])

  return (
    <Select
      value={selectedBotId}
      onChange={e => onBotChange(e.target.value)}
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="all">All Bots</MenuItem>
      {botOptions.map(bot => (
        <MenuItem key={bot.bot_id} value={bot.bot_id}>
          {bot.bot_name}
        </MenuItem>
      ))}
    </Select>
  )
}
