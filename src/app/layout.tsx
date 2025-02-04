// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReactNode, Suspense } from "react"
import { Layout } from "@/components/index"
import NextAppProviderWrapper from "@/providers/NextAppProviderWrapper"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import ChatbotProvider from "@/providers/ChatbotProvider"
import { SessionProvider } from "next-auth/react"

import "../styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "b2blead",
  description: "Analytics dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <SessionProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <NextAppProviderWrapper>
                <ChatbotProvider>
                  <Layout>{children}</Layout>
                </ChatbotProvider>
              </NextAppProviderWrapper>
            </AppRouterCacheProvider>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  )
}
