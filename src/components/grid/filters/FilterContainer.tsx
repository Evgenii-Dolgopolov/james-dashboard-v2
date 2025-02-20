// src/components/grid/filters/FilterContainer.tsx
import React from "react"
import { Box } from "@mui/material"
import { TimeFilter } from "./TimeFilter"
import { BotFilter } from "./BotFilter"
import type { Bot } from "@/lib/supabase/queries"


type FilterContainerProps = {
 timeFilter: string
 selectedBotId: string
 onTimeFilterChange: (value: string) => void
 onBotChange: (value: string) => void
 botOptions: Bot[]
}


export const FilterContainer: React.FC<FilterContainerProps> = ({
 timeFilter,
 selectedBotId,
 onTimeFilterChange,
 onBotChange,
 botOptions,
}) => {
 return (
   <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
     <TimeFilter
       timeFilter={timeFilter}
       onTimeFilterChange={onTimeFilterChange}
     />
     <BotFilter
       selectedBotId={selectedBotId}
       onBotChange={onBotChange}
       botOptions={botOptions}
     />
   </Box>
 )
}
