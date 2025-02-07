// src/components/grid/threads/ThreadsColumns.tsx
import { useRouter } from "next/navigation"
import { calculateThreadDuration } from "@/utils/formatters"
import { GridRenderCellParams } from "@mui/x-data-grid"
import type { Message } from "@/lib/supabase/queries"

// Define the type for our row data
type ThreadRow = Message & {
  threadMessages: Message[]
  duration: string
}

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
      renderCell: (params: GridRenderCellParams<ThreadRow, string>) => {
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
      field: "duration",
      headerName: "Duration",
      flex: 1,
      minWidth: 80,
      editable: false,
      renderCell: (params: GridRenderCellParams<ThreadRow>) => {
        if (!params?.row?.threadMessages) {
          return <div>0:00</div>
        }

        const duration = calculateThreadDuration(params.row.threadMessages)
        return (
          <div style={{ textAlign: "right", width: "100%" }}>{duration}</div>
        )
      },
      align: "right",
      headerAlign: "right",
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
