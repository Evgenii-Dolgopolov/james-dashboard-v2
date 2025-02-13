// src/components/grid/filters/BotFilter.tsx
import React, { useEffect, useState } from "react"
import { Select, MenuItem, CircularProgress } from "@mui/material"
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBotOptions = async () => {
      try {
        setLoading(true)
        setError(null)
        const bots = await fetchBotNames()
        setBotOptions(bots)
      } catch (err) {
        console.error("Failed to load bots:", err)
        setError("Failed to load bot options")
        // Set default empty array on error
        setBotOptions([])
      } finally {
        setLoading(false)
      }
    }
    loadBotOptions()
  }, [])

  if (loading) {
    return <CircularProgress size={24} />
  }

  if (error) {
    // Still render the select but with limited functionality
    return (
      <Select value="all" disabled sx={{ minWidth: 200 }}>
        <MenuItem value="all">All Bots</MenuItem>
      </Select>
    )
  }

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
