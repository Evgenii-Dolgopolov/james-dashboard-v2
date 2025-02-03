"use client"

import { UserDataGrid } from "@/components/index"
import { FC } from "react"

import { auth } from "../../../auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const DashboardPage: FC = () => {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const session = await auth()
      if (!session) router.push("/login")
    }
    checkAuth()
  }, [router])

  return <UserDataGrid />
}

export default DashboardPage
