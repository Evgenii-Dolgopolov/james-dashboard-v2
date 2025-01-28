const formatDate = (dateString: string) => {
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

export { formatDate }
