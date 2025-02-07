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
  messages: { created_at: string }[],
): string {
  // Handle edge cases
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return "00:00:00"
  }

  // Sort messages by created_at
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  // Ensure we have at least two unique timestamps
  if (
    sortedMessages.length < 2 ||
    new Date(sortedMessages[0].created_at).getTime() ===
      new Date(sortedMessages[sortedMessages.length - 1].created_at).getTime()
  ) {
    return "00:00:00"
  }

  const startTime = new Date(sortedMessages[0].created_at)
  const endTime = new Date(sortedMessages[sortedMessages.length - 1].created_at)

  const durationInSeconds = Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000,
  )

  // Ensure non-negative duration
  if (durationInSeconds <= 0) {
    return "00:00:00"
  }

  const hours = Math.floor(durationInSeconds / 3600)
  const minutes = Math.floor((durationInSeconds % 3600) / 60)
  const seconds = durationInSeconds % 60

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}
