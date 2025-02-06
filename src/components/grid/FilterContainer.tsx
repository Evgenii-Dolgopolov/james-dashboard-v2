import React from "react"
import { Box } from "@mui/material"
import { TimeFilterComponent } from "./TimeFilterComponent"
import { BotFilterComponent } from "./BotFilterComponent"

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
      <TimeFilterComponent
        timeFilter={timeFilter}
        onTimeFilterChange={onTimeFilterChange}
      />
      <BotFilterComponent
        selectedBotId={selectedBotId}
        onBotChange={onBotChange}
      />
    </Box>
  )
}
