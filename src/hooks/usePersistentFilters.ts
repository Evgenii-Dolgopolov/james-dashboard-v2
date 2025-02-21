// src/hooks/usePersistentFilters.ts
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

type FilterState = {
  timeFilter: string
  selectedBotId: string
}

export const usePersistentFilters = (initialState: FilterState) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  // Initialize with provided defaults
  const [state, setState] = useState<FilterState>(initialState)

  // Load saved filters from localStorage on component mount
  useEffect(() => {
    if (!userId) return

    try {
      const savedFilters = localStorage.getItem(`dashboard_filters_${userId}`)
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters) as FilterState
        setState(parsedFilters)
      }
    } catch (error) {
      console.error("Error loading saved filters:", error)
    }
  }, [userId])

  // Save filters to localStorage whenever they change
  const updateFilters = (newState: Partial<FilterState>) => {
    if (!userId) return

    const updatedState = { ...state, ...newState }
    setState(updatedState)

    try {
      localStorage.setItem(
        `dashboard_filters_${userId}`,
        JSON.stringify(updatedState),
      )
    } catch (error) {
      console.error("Error saving filters:", error)
    }
  }

  const setTimeFilter = (timeFilter: string) => {
    updateFilters({ timeFilter })
  }

  const setBotFilter = (selectedBotId: string) => {
    updateFilters({ selectedBotId })
  }

  return {
    timeFilter: state.timeFilter,
    selectedBotId: state.selectedBotId,
    setTimeFilter,
    setBotFilter,
  }
}
