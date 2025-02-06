import React from "react"
import { Box } from "@mui/material"
import { TimeFilter } from "./TimeFilter"
import { BotFilter } from "./BotFilter"

type FilterContainerProps = {
  timeFilter: string
  selectedBotId: string
  onTimeFilterChange: (value: string) => void
  onBotChange: (value: string) => void
}

export const FilterContainer: React.FC<FilterContainerProps> = ({
  timeFilter,
  selectedBotId,
  onTimeFilterChange,
  onBotChange,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TimeFilter
        timeFilter={timeFilter}
        onTimeFilterChange={onTimeFilterChange}
      />
      <BotFilter
        selectedBotId={selectedBotId}
        onBotChange={onBotChange}
      />
    </Box>
  )
}
