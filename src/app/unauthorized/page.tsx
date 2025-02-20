// src/app/unauthorized/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { Box, Typography, Button } from "@mui/material"
import { signOut } from "next-auth/react"

const getErrorMessage = (reason: string | null) => {
  switch (reason) {
    case "no-bot-assignments":
      return "You don't have any bots assigned to your account. Please contact your administrator."
    default:
      return "You don't have permission to access this resource."
  }
}

export default function UnauthorizedPage() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Access Denied
      </Typography>

      <Typography color="text.secondary" sx={{ maxWidth: 450, mb: 4 }}>
        {getErrorMessage(reason)}
      </Typography>

      <Button
        variant="contained"
        onClick={handleSignOut}
        sx={{ minWidth: 200 }}
      >
        Sign Out
      </Button>
    </Box>
  )
}
