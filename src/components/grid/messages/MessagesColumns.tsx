// src/components/grid/messages/MessagesColumns.tsx
import { useBotAssignments } from "@/hooks/useBotAssignments"

export const MessagesColumns = () => {
  const { hasMultipleBots } = useBotAssignments()

  // Define all columns
  const allColumns = [
    {
      field: "created_at",
      headerName: "Time",
      flex: 1,
      minWidth: 165,
      editable: false,
    },
    {
      field: "bot_name",
      headerName: "Bot Name",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "thread_id",
      headerName: "Thread ID",
      flex: 1,
      minWidth: 100,
      editable: false,
      sortable: false,
    },
    {
      field: "user_message",
      headerName: "User message",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "suggested_message",
      headerName: "Suggested Message",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "bot_message",
      headerName: "Bot Message",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "user_email",
      headerName: "Callback",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "user_name",
      headerName: "user_name",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "user_phone",
      headerName: "user_phone",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "user_company",
      headerName: "user_company",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "user_callback_message",
      headerName: "user_callback_message",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
  ]

  // Filter out the bot_name column if user only has one bot assigned
  return allColumns.filter(
    column => hasMultipleBots || column.field !== "bot_name",
  )
}
