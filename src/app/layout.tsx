// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReactNode, Suspense } from "react"
import { Layout } from "@/components/index"
import { AppProviders } from "@/providers/AppProviders"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import { SessionProvider } from "next-auth/react"
import { AuthErrorBoundary } from "@/components/error/AuthErrorBoundary"

import "@/styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "b2blead",
  description: "Analytics grid",
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
              <AppProviders>
                <AuthErrorBoundary>
                  <Layout>{children}</Layout>
                </AuthErrorBoundary>
              </AppProviders>
            </AppRouterCacheProvider>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  )
}
