import React, { useEffect, useState } from "react"
import { Select, MenuItem } from "@mui/material"
import { fetchBotNames } from "@/services/fetchChatbotMessages"

type BotFilterProps = {
  selectedBotId: string
  onBotChange: (value: string) => void
}

type BotOption = {
  name: string
  id: string
}

export const BotFilterComponent: React.FC<BotFilterProps> = ({
  selectedBotId,
  onBotChange,
}) => {
  const [botOptions, setBotOptions] = useState<BotOption[]>([])

  useEffect(() => {
    const loadBotOptions = async () => {
      try {
        const bots = await fetchBotNames()
        setBotOptions(bots.map(b => ({ name: b.bot_name, id: b.bot_id })))
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
        <MenuItem key={bot.id} value={bot.id}>
          {bot.name}
        </MenuItem>
      ))}
    </Select>
  )
}
