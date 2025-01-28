"use client"

import { NextAppProvider } from "@toolpad/core/nextjs"
import { NAVIGATION } from "@/config/sidebarNavigation"
import { createTheme } from "@mui/material/styles"


export default function NextAppProviderWrapper({ children }) {
  return (
    <NextAppProvider
      navigation={NAVIGATION}
      branding={{ title: "", logo: "" }}
      theme={createTheme({
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
      })}
    >
      {children}
    </NextAppProvider>
  )
}