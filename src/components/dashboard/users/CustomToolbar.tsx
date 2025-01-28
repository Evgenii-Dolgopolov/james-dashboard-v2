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

export const CustomToolbar = ({ ...props }) => {
  // const router = useRouter()

  // const handleClick = () => {
  //   router.push("/create-user")
  // }

  return (
    <GridToolbarContainer
      {...props}
      sx={{
        marginTop: 2, // Add margin to the top
        paddingTop: 2, // Add padding to the top
        height: "auto", // Adjust height if needed
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