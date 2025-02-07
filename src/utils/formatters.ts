import { Message } from "@/lib/supabase/queries"

type ExtendedMessage = Message & {
  suggested_message?: string // Making it optional with ?
}

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

    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return ""
}

export function calculateThreadDuration(messages: ExtendedMessage[]): string {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return "00:00:00"
  }

  // Sort messages by created_at
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  // Find first actual message
  const firstMessage = sortedMessages.find(
    msg => msg.user_message || msg.suggested_message,
  )

  if (!firstMessage) {
    return "00:00:00"
  }

  // Find last message with any content
  const lastMessage = [...sortedMessages]
    .reverse()
    .find(
      msg =>
        msg.user_message ||
        msg.suggested_message ||
        msg.bot_message ||
        msg.user_email,
    )

  if (!lastMessage) {
    return "00:00:00"
  }

  const startTime = new Date(firstMessage.created_at)
  const endTime = new Date(lastMessage.created_at)

  const durationInSeconds = Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000,
  )

  const hours = Math.floor(durationInSeconds / 3600)
  const minutes = Math.floor((durationInSeconds % 3600) / 60)
  const seconds = durationInSeconds % 60

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}
