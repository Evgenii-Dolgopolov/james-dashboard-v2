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
  // Get the session state to check if user is authenticated
  const { data: session, status } = useSession()

  // Handler for protected route navigation
  const handleProtectedNavigation = (path: string) => {
    if (!session) {
      // If not authenticated, redirect to login and store intended destination
      router.push(`/login?callbackUrl=${encodeURIComponent(path)}`)
    } else {
      // If authenticated, allow navigation
      router.push(path)
    }
  }

  // Handler for logout
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
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
              onClick={() => handleProtectedNavigation("/dashboard/users")}
              color="inherit"
            >
              Dashboard
            </Button>

            <Button
              onClick={() => handleProtectedNavigation("/charts")}
              color="inherit"
            >
              Charts
            </Button>

            {/* Conditionally render Login/Logout button based on auth state */}
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
