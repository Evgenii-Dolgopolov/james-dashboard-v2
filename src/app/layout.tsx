import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReactNode, Suspense } from 'react';
import { Layout } from "@/components/index"
import Providers from "@/providers/Providers"
import NextAppProviderWrapper from "@/providers/NextAppProviderWrapper"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"

import "../styles/globals.css"

// Load the Inter font with specific weights and subsets
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
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <NextAppProviderWrapper>
              <Providers>
                <Layout>{children}</Layout>
              </Providers>
            </NextAppProviderWrapper>
          </AppRouterCacheProvider>
        </Suspense>
      </body>
    </html>
  )
}
