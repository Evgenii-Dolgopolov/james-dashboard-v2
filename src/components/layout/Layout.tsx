"use client"

import { Footer, Header } from "@/components/index"
import { FC } from "react"
import { LayoutProps } from "@/types/layout"

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-w-fit mx-auto">
      <Header />
      <div className="min-h-screen flex flex-col justify-between">
        <main className=" max-w-[1536px] container m-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
