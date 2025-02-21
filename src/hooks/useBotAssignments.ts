// src/hooks/useBotAssignments.ts
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { fetchBotNames, type Bot } from "@/lib/supabase/queries"

export const useBotAssignments = () => {
  const { data: session, status } = useSession()
  const [assignedBots, setAssignedBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loadBotOptions = async () => {
      if (status !== "authenticated" || !session?.user?.id) {
        if (status !== "loading") {
          // If not loading and not authenticated, we consider it initialized
          setLoading(false)
          setIsInitialized(true)
        }
        return
      }

      try {
        setLoading(true)
        const bots = await fetchBotNames(session.user.id)
        setAssignedBots(bots)
        setLoading(false)
        setIsInitialized(true)
      } catch (err) {
        console.error("Error loading bot options:", err)
        setError(
          err instanceof Error ? err.message : "Failed to load bot assignments",
        )
        setLoading(false)
        setIsInitialized(true)
      }
    }

    loadBotOptions()
  }, [session?.user?.id, status])

  const hasSingleBot = assignedBots.length === 1
  const hasMultipleBots = assignedBots.length > 1
  const singleBotId = hasSingleBot ? assignedBots[0]?.bot_id : null
  const singleBotName = hasSingleBot ? assignedBots[0]?.bot_name : null

  return {
    assignedBots,
    loading,
    isInitialized,
    error,
    hasSingleBot,
    hasMultipleBots,
    singleBotId,
    singleBotName,
  }
}
