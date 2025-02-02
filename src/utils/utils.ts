export const formatDate = (dateString: string) => {
  if (!dateString) {
    return "" // Return empty string if the date is invalid or empty
  }

  const date = new Date(dateString)
  if (date instanceof Date) {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0") // Months are 0-indexed
    const day = String(date.getUTCDate()).padStart(2, "0")
    const hours = String(date.getUTCHours()).padStart(2, "0")
    const minutes = String(date.getUTCMinutes()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}` // Desired format
  }

  return "" // Fallback to empty string if the date is invalid
}

export const filterRowsByTime = (rows: any[], timeFilter: string) => {
  const now = new Date() // Current date and time

  return rows.filter((row: any) => {
    const rowDate = new Date(row.created_at) // Convert row's created_at to a Date object

    switch (timeFilter) {
      case "today":
        return rowDate.toDateString() === now.toDateString() // Compare only the date part
      case "thisWeek":
        const startOfWeek = new Date(now) // Create a new Date object for startOfWeek
        startOfWeek.setDate(now.getDate() - 7) // Subtract 7 days from the current date
        return rowDate >= startOfWeek // Check if rowDate is within the last 7 days
      case "last30Days":
        const startOf30Days = new Date(now) // Create a new Date object for startOf30Days
        startOf30Days.setDate(now.getDate() - 30) // Subtract 30 days from the current date
        return rowDate >= startOf30Days // Check if rowDate is within the last 30 days
      default:
        return true // Show all rows if no filter is selected
    }
  })
}
