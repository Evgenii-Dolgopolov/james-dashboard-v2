// import { GridRowModes, GridActionsCellItem } from "@mui/x-data-grid"
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Save as SaveIcon,
//   Cancel as CancelIcon,
// } from "@mui/icons-material"

export const DataColumns = (
  // rowModesModel,
  // handleSaveClick,
  // handleCancelClick,
  // handleEditClick,
  // handleDeleteClick,
) => [
    {
      field: "created_at",
      headerName: "Time",
      flex: 1,
      minWidth: 150, // Adjusted width to accommodate the formatted date
      editable: false,
    },
    {
      field: "bot_name",
      headerName: "Bot Name",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "thread_id",
      headerName: "Thread ID",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "user_message",
      headerName: "User message",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "bot_message",
      headerName: "Bot Message",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "callback",
      headerName: "Callback",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    // {
    //   field: "actions",
    //   type: "actions",
    //   headerName: "Actions",
    //   flex: 1,
    //   minWidth: 50,
    //   cellClassName: "actions",
    //   getActions: ({ id }) => {
    //     const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

    //     if (isInEditMode) {
    //       return [
    //         <GridActionsCellItem
    //           key={`save-${id}`}
    //           icon={<SaveIcon />}
    //           label="Save"
    //           onClick={handleSaveClick(id)}
    //           color="primary"
    //           disabled={false}
    //         />,
    //         <GridActionsCellItem
    //           key={`cancel-${id}`}
    //           icon={<CancelIcon />}
    //           label="Cancel"
    //           onClick={handleCancelClick(id)}
    //           color="inherit"
    //           disabled={false}
    //         />,
    //       ]
    //     }

    //     return [
    //       <GridActionsCellItem
    //         key={`edit-${id}`}
    //         icon={<EditIcon />}
    //         label="Edit"
    //         onClick={handleEditClick(id)}
    //         color="inherit"
    //         disabled={false}
    //       />,
    //       <GridActionsCellItem
    //         key={`delete-${id}`}
    //         icon={<DeleteIcon />}
    //         label="Delete"
    //         onClick={handleDeleteClick(id)}
    //         color="inherit"
    //         disabled={false}
    //       />,
    //     ]
    //   },
    // },
  ]
