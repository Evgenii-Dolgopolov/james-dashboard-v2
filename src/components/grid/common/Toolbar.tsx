// src/components/grid/common/Toolbar.tsx
"use client"

// import { useRouter } from "next/navigation"
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid"
// import { Button } from "@mui/material"
// import AddIcon from "@mui/icons-material/Add"

export const Toolbar = ({ ...props }) => {
  // const router = useRouter()

  // const handleClick = () => {
  //   router.push("/create-user")
  // }

  return (
    <GridToolbarContainer
      {...props}
      sx={{
        height: "auto",
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 0,
        m: 0,
      }}
    >
      {/* <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add User
      </Button> */}
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}
