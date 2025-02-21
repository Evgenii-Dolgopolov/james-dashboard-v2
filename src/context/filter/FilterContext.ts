// src/context/filter/FilterContext.ts
import { createContext, useContext } from "react"

export type FilterContextType = {
  timeFilter: string
  selectedBotId: string
  setTimeFilter: (value: string) => void
  setBotFilter: (value: string) => void
}

export const FilterContext = createContext<FilterContextType>({
  timeFilter: "all",
  selectedBotId: "all",
  setTimeFilter: () => {},
  setBotFilter: () => {}
})

export const useFilterContext = () => useContext(FilterContext)