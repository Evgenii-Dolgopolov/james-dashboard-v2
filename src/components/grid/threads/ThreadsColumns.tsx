// src/components/grid/threads/ThreadsColumns.tsx
import { useRouter } from "next/navigation"

export const ThreadsColumns = () => {
  const router = useRouter()

  return [
    {
      field: "created_at",
      headerName: "Time",
      flex: 1,
      minWidth: 150,
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
      renderCell: params => {
        return (
          <div
            className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
            onClick={() =>
              router.push(`/dashboard/messages?thread=${params.value}`)
            }
          >
            {params.value}
          </div>
        )
      },
    },
    {
      field: "user_message",
      headerName: "Number of Messages",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "bot_message",
      headerName: "Duration",
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
      field: "user",
      headerName: "Sentiment",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
  ]
}
