// src/utils/filters.ts
import { Message } from "@/lib/supabase/queries"

export function filterRowsByTime(
  rows: Message[],
  timeFilter: string,
): Message[] {
  const now = new Date()

  return rows.filter(row => {
    const rowDate = new Date(row.created_at)

    switch (timeFilter) {
      case "today":
        return rowDate.toDateString() === now.toDateString()
      case "thisWeek":
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - 7)
        return rowDate >= startOfWeek
      case "last30Days":
        const startOf30Days = new Date(now)
        startOf30Days.setDate(now.getDate() - 30)
        return rowDate >= startOf30Days
      default:
        return true
    }
  })
}
