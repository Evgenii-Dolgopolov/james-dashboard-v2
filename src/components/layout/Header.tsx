"use client"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { FC } from "react"

const Header: FC = () => {
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleProtectedNavigation = (path: string) => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(path)}`)
    } else {
      router.push(path)
    }
  }

  // Enhanced logout handler with proper session cleanup
  const handleLogout = async () => {
    try {
      // SignOut with specific configuration to ensure complete cleanup
      await signOut({
        redirect: false, // We'll handle redirect manually
        redirectTo: "/",
      })

      // Force a hard navigation to the home page
      // This ensures all session data is cleared from memory
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              User Dashboard
            </Typography>

            <Button
              onClick={() => handleProtectedNavigation("/dashboard/messages")}
              color="inherit"
              disabled={status === "loading"} // Prevent clicks during session check
            >
              Dashboard
            </Button>

            <Button
              onClick={() => handleProtectedNavigation("/charts")}
              color="inherit"
              disabled={status === "loading"} // Prevent clicks during session check
            >
              Charts
            </Button>

            {!session ? (
              <Button onClick={() => router.push("/login")} color="inherit">
                Login
              </Button>
            ) : (
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  )
}

export default Header
