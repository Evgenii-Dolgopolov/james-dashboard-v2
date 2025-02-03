"use client"

import { DashboardLayout } from "@toolpad/core/DashboardLayout"
import { ReactNode, Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "../../auth"

export default function DashboardPagesLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const session = await auth()
      if (!session) router.push("/login")
    }
    checkAuth()
  }, [router])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout defaultSidebarCollapsed sx={{ overflow: "auto", width: "100%" }}>
        {children}
      </DashboardLayout>
    </Suspense>
  )
}