// src/components/error/AuthErrorBoundary.tsx
"use client"

import React from "react"
import { Box, Typography, Button } from "@mui/material"
import { signOut } from "next-auth/react"

type AuthErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

type AuthErrorBoundaryProps = {
  children: React.ReactNode
}

export class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error }
  }

  handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const isAuthError =
        this.state.error?.message.toLowerCase().includes("unauthorized") ||
        this.state.error?.message.toLowerCase().includes("authentication")

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: 2,
            p: 3,
          }}
        >
          <Typography variant="h5" color="error">
            {isAuthError ? "Authorization Error" : "Something went wrong"}
          </Typography>

          <Typography
            color="text.secondary"
            align="center"
            sx={{ maxWidth: 500 }}
          >
            {isAuthError
              ? "You don't have permission to access this resource. Please check your credentials and try again."
              : this.state.error?.message || "An unexpected error occurred"}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={this.handleRetry}
              sx={{ mr: 1 }}
            >
              Try Again
            </Button>

            {isAuthError && (
              <Button variant="outlined" onClick={this.handleSignOut}>
                Sign Out
              </Button>
            )}
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}
