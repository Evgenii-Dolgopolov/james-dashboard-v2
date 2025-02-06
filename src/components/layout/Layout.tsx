"use client"

import { Footer, Header } from "@/components/index"
import { FC, ReactNode } from "react"

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-w-fit mx-auto">
      <Header />
      <div className="min-h-screen flex flex-col justify-between">
        <main className=" max-w-[1536px] container m-auto">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
