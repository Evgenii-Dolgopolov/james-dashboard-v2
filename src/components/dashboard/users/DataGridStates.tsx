import { Box, Typography } from "@mui/material"
import React from "react"

export const LoadingState = () => {
  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.paper",
        borderRadius: 1,
      }}
    >
      <Typography color="text.secondary">Loading...</Typography>
    </Box>
  )
}

export const ErrorState = ({ error }: { error: string }) => {
  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.paper",
        borderRadius: 1,
      }}
    >
      <Typography color="error">Error: {error}</Typography>
    </Box>
  )
}

export const EmptyState = () => {
  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.paper",
        borderRadius: 1,
      }}
    >
      <Typography color="text.secondary">No messages found</Typography>
    </Box>
  )
}
