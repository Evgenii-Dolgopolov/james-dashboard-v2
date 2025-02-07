// src/utils/formatters.ts

export function formatDate(dateString: string): string {
  if (!dateString) {
    return ""
  }

  const date = new Date(dateString)
  if (date instanceof Date) {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const day = String(date.getUTCDate()).padStart(2, "0")
    const hours = String(date.getUTCHours()).padStart(2, "0")
    const minutes = String(date.getUTCMinutes()).padStart(2, "0")
    const seconds = String(date.getUTCSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return ""
}

export function calculateThreadDuration(
  messages: { created_at: string }[]
): string {
  if (!messages || messages.length < 2) {
    return "00:00:00"
  }

  const timestamps = messages
    .map(m => new Date(m.created_at).getTime())
    .sort((a, b) => a - b)

  const duration = timestamps[timestamps.length - 1] - timestamps[0]
  const seconds = Math.floor(duration / 1000)
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
}
