// src/context/filter/FilterProvider.tsx
"use client"

import React, { ReactNode } from "react"
import { FilterContext } from "../context/filter/FilterContext"
import { usePersistentFilters } from "@/hooks/usePersistentFilters"

type FilterProviderProps = {
  children: ReactNode
  initialTimeFilter?: string
  initialBotId?: string
}

export const FilterProvider: React.FC<FilterProviderProps> = ({
  children,
  initialTimeFilter = "all",
  initialBotId = "all"
}) => {
  const {
    timeFilter,
    selectedBotId,
    setTimeFilter,
    setBotFilter
  } = usePersistentFilters({
    timeFilter: initialTimeFilter,
    selectedBotId: initialBotId
  })

  return (
    <FilterContext.Provider
      value={{
        timeFilter,
        selectedBotId,
        setTimeFilter,
        setBotFilter
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}