import React from "react"
import DashboardIcon from "@mui/icons-material/Dashboard"
import MessageIcon from "@mui/icons-material/Message"
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer"
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback"
import { ReactElement } from "react"

type NavigationItem = {
  segment: string
  title: string
  icon?: ReactElement
  children?: NavigationItem[]
}

const NAVIGATION: NavigationItem[] = [
  {
    segment: "dashboard/messages",
    title: "Message View",
    icon: React.createElement(MessageIcon),
  },
  {
    segment: "dashboard/threads",
    title: "Thread View",
    icon: React.createElement(QuestionAnswerIcon),
  },
  {
    segment: "dashboard/callback",
    title: "Callback",
    icon: React.createElement(PhoneCallbackIcon),
  },
]

export { NAVIGATION }
