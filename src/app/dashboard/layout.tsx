"use client"

import { DashboardLayout } from "@toolpad/core/DashboardLayout"
import { ReactNode, Suspense } from "react"

export default function DashboardPagesLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout
        defaultSidebarCollapsed
        sx={{ overflow: "auto", width: "100%" }}
      >
        {children}
      </DashboardLayout>
    </Suspense>
  )
}
