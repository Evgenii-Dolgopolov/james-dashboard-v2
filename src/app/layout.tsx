import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import { Layout } from "@/components/index"
import Providers from "@/providers/Providers"
import NextAppProviderWrapper from "@/providers/NextAppProviderWrapper"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import "./globals.css"

// Load the Inter font with specific weights and subsets
// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-inter",
// })

export const metadata: Metadata = {
  title: "b2blead",
  description: "Analytics dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" >
      <body className="antialiased">
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <NextAppProviderWrapper>
            <Providers>
              <Layout>{children}</Layout>
            </Providers>
          </NextAppProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
