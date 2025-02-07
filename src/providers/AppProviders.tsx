// src/providers/AppProviders.tsx
"use client"

import { ReactNode } from "react"
import { NextAppProvider } from "@toolpad/core/nextjs"
import { NAVIGATION } from "@/config/navigation"
import { createTheme } from "@mui/material/styles"
import { ChatbotProvider } from "./ChatbotProvider"

type AppProvidersProps = {
  children: ReactNode
}

const theme = createTheme({
  colorSchemes: { light: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
})

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <NextAppProvider
      navigation={NAVIGATION}
      branding={{ title: "", logo: "" }}
      theme={theme}
    >
      <ChatbotProvider>{children}</ChatbotProvider>
    </NextAppProvider>
  )
}
