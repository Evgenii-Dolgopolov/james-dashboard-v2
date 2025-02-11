// src/components/grid/threads/ThreadsColumns.tsx
import { useRouter } from "next/navigation"
import { GridRenderCellParams, GridColDef } from "@mui/x-data-grid"
import type { Message } from "@/lib/supabase/queries"

type ThreadRow = Message & {
  threadMessages: Message[]
  duration: string
  totalMessages: number
}

export const ThreadsColumns = (): GridColDef<ThreadRow>[] => {
  const router = useRouter()

  return [
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
      field: "totalMessages", 
      headerName: "Number of Messages",
      flex: 1,
      minWidth: 150,
      editable: false,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      minWidth: 80,
      editable: false,
      sortable: true,
      renderCell: (params: GridRenderCellParams<ThreadRow>) => {
        try {
          const duration = params.row.duration || "00:00:00"
          return (
            <div style={{ textAlign: "right", width: "100%" }}>{duration}</div>
          )
        } catch (error) {
          console.error("Error in duration renderCell:", error)
          return <div style={{ textAlign: "right", width: "100%" }}>00:00:00</div>
        }
      },
      sortComparator: (v1: string, v2: string) => {
        const toSeconds = (duration: string) => {
          try {
            if (!duration) return 0

            // Split into parts and reverse to handle both HH:MM:SS and MM:SS formats
            const parts = duration.split(":").reverse()

            // Convert all parts to numbers, defaulting to 0 for invalid values
            const [seconds, minutes, hours] = parts.map(part => {
              const num = parseInt(part, 10)
              return isNaN(num) ? 0 : num
            })

            return hours * 3600 + minutes * 60 + seconds
          } catch (error) {
            console.error("Error parsing duration:", error)
            return 0
          }
        }

        const seconds1 = toSeconds(v1)
        const seconds2 = toSeconds(v2)

        return seconds1 - seconds2
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