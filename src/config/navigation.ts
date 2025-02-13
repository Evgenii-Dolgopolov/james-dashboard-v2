// src/config/navigation.ts
import React, { ReactElement } from "react"
import MessageIcon from "@mui/icons-material/Message"
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer"
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback"

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
