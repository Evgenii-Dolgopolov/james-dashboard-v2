// src/components/grid/filters/FilterContainer.tsx
import React from "react"
import { Box } from "@mui/material"
import { TimeFilter } from "./TimeFilter"
import { BotFilter } from "./BotFilter"
import { useFilterContext } from "@/context/filter/FilterContext"
import type { Bot } from "@/lib/supabase/queries"

type FilterContainerProps = {
  onTimeFilterChange?: (value: string) => void
  onBotChange?: (value: string) => void
  botOptions: Bot[]
}

export const FilterContainer: React.FC<FilterContainerProps> = ({
  onTimeFilterChange,
  onBotChange,
  botOptions,
}) => {
  // Use our filter context
  const {
    timeFilter,
    selectedBotId,
    setTimeFilter,
    setBotFilter
  } = useFilterContext()

  // Handle time filter change
  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value)
    if (onTimeFilterChange) {
      onTimeFilterChange(value)
    }
  }

  // Handle bot filter change
  const handleBotChange = (value: string) => {
    setBotFilter(value)
    if (onBotChange) {
      onBotChange(value)
    }
  }

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <TimeFilter
        timeFilter={timeFilter}
        onTimeFilterChange={handleTimeFilterChange}
      />
      <BotFilter
        selectedBotId={selectedBotId}
        onBotChange={handleBotChange}
        botOptions={botOptions}
      />
    </Box>
  )
}