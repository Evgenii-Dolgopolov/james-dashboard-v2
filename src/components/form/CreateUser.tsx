// "use client"
// import React, { useContext, useState } from "react"
// import { useRouter } from "next/navigation"
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Checkbox,
//   FormGroup,
//   FormControlLabel,
//   FormLabel,
//   Radio,
//   RadioGroup,
//   Switch,
//   Rating,
//   ButtonGroup,
// } from "@mui/material"
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
// import { DatePicker } from "@mui/x-date-pickers/DatePicker"
// import { ChatbotProvider } from "@/context/ChatbotProvider"
// import { formatContactMethodOptions } from "@/lib/utils/utils"

// const initialFormState = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   occupation: "",
//   gender: "",
//   dateOfBirth: null,
//   contactMethod: {
//     sms: false,
//     email: false,
//     phone: false,
//   },
//   maritalStatus: "Single",
//   newsletterSubscription: true,
//   rating: 0,
// }

// const CreateUser = () => {
//   const router = useRouter()

//   const usersContext = useContext(UsersContext)
//   const [formData, setFormData] = useState(initialFormState)

//   const handleInputChange = event => {
//     const { name, value } = event.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleContactMethodChange = method => event => {
//     setFormData(prev => ({
//       ...prev,
//       contactMethod: {
//         ...prev.contactMethod,
//         [method]: event.target.checked,
//       },
//     }))
//   }

//   const handleDateChange = value => {
//     setFormData(prev => ({
//       ...prev,
//       dateOfBirth: value,
//     }))
//   }

//   const handleNewsletterChange = event => {
//     setFormData(prev => ({
//       ...prev,
//       newsletterSubscription: event.target.checked,
//     }))
//   }

//   const handleRatingChange = (event, value) => {
//     setFormData(prev => ({
//       ...prev,
//       rating: value,
//     }))
//   }

//   const handleSubmit = event => {
//     event.preventDefault()

//     const newUser = {
//       ...formData,
//       id: crypto.randomUUID(),
//       newsletterSubscription: formData.newsletterSubscription ? "Subscribed" : "Not Subscribed",
//       dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toDate() : null,
//       contactMethod: formatContactMethodOptions(Object.entries(formData.contactMethod))
//     }

//     usersContext.setUsers([...usersContext.users, newUser])

//     router.push("/dashboard/users")
//   }

//   const handleResetForm = event => {
//     event.preventDefault()
//     setFormData(initialFormState)
//   }

//   return (
//     <Box
//       component="form"
//       autoComplete="off"
//       onSubmit={handleSubmit}
//       sx={{
//         maxWidth: 1000,
//         mx: "auto",
//         p: 2,
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//       }}
//     >
//       <Typography
//         className="flex items-center justify-center text-2xl font-bold"
//         component="h1"
//         variant="h6"
//         color="primary"
//       >
//         Create new user form
//       </Typography>

//       {/*First row of inputs*/}
//       <div className="flex items-center justify-between gap-4">
//         <TextField
//           name="firstName"
//           label="First Name"
//           variant="outlined"
//           margin="normal"
//           required
//           fullWidth
//           value={formData.firstName}
//           onChange={handleInputChange}
//         />

//         <TextField
//           name="lastName"
//           label="Last Name"
//           variant="outlined"
//           margin="normal"
//           required
//           fullWidth
//           value={formData.lastName}
//           onChange={handleInputChange}
//         />

//         <TextField
//           name="email"
//           label="Email Address"
//           variant="outlined"
//           margin="normal"
//           required
//           fullWidth
//           value={formData.email}
//           onChange={handleInputChange}
//         />
//       </div>

//       {/*Second row of inputs*/}
//       <div className="flex items-center justify-between gap-4">
//         <div className="flex-1">
//           <TextField
//             name="occupation"
//             label="Occupation"
//             variant="outlined"
//             margin="normal"
//             fullWidth
//             value={formData.occupation}
//             onChange={handleInputChange}
//           />
//         </div>

//         {/*Gender dropdown*/}
//         <div className="flex-1">
//           <FormControl fullWidth margin="normal">
//             <InputLabel id="gender-select-label">Gender</InputLabel>
//             <Select
//               name="gender"
//               labelId="gender-select-label"
//               id="gender-select"
//               label="Gender"
//               variant="outlined"
//               value={formData.gender}
//               onChange={handleInputChange}
//             >
//               <MenuItem value={"Male"}>Male</MenuItem>
//               <MenuItem value={"Female"}>Female</MenuItem>
//             </Select>
//           </FormControl>
//         </div>

//         {/*Date picker*/}
//         <div className="flex-1">
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//               label="Birth Date"
//               value={formData.dateOfBirth}
//               onChange={handleDateChange}
//               sx={{
//                 width: "100%",
//                 mt: 2,
//                 mb: 1,
//               }}
//               slotProps={{
//                 textField: {
//                   required: false,
//                 },
//               }}
//             />
//           </LocalizationProvider>
//         </div>
//       </div>

//       {/*Third row of inputs*/}
//       <div className="flex items-center justify-between gap-4">
//         {/*Check box*/}
//         <div>
//           <FormGroup>
//             <FormLabel component="legend">Contact Method</FormLabel>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={formData.contactMethod.sms}
//                   onChange={handleContactMethodChange("sms")}
//                 />
//               }
//               label="SMS"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={formData.contactMethod.email}
//                   onChange={handleContactMethodChange("email")}
//                 />
//               }
//               label="Email"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={formData.contactMethod.phone}
//                   onChange={handleContactMethodChange("phone")}
//                 />
//               }
//               label="Phone"
//             />
//           </FormGroup>
//         </div>

//         {/*Radio buttons*/}
//         <FormControl>
//           <FormLabel>Marital status</FormLabel>
//           <RadioGroup
//             name="maritalStatus"
//             value={formData.maritalStatus}
//             onChange={handleInputChange}
//           >
//             <FormControlLabel
//               value="Single"
//               control={<Radio />}
//               label="Single"
//             />
//             <FormControlLabel
//               value="Married"
//               control={<Radio />}
//               label="Married"
//             />
//             <FormControlLabel
//               value="Divorced"
//               control={<Radio />}
//               label="Divorced"
//             />
//           </RadioGroup>
//         </FormControl>

//         <div className="flex flex-col items-center justify-between gap-10">
//           {/*Rating*/}
//           <div className="flex flex-col items-center">
//             <FormLabel>Rate your experience</FormLabel>
//             <Rating
//               name="rating"
//               value={formData.rating}
//               onChange={handleRatingChange}
//               precision={1}
//               size="large"
//             />
//           </div>

//           {/*Toggle switch*/}
//           <FormGroup>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={formData.newsletterSubscription}
//                   onChange={handleNewsletterChange}
//                   name="newsletterSubscription"
//                 />
//               }
//               label="Subscribe to newsletter"
//               labelPlacement="top"
//               sx={{
//                 "& .MuiFormControlLabel-label": {
//                   color: "grey.700",
//                 },
//               }}
//             />
//           </FormGroup>
//         </div>
//       </div>

//       {/*Fourth row of inputs*/}
//       {/*Navigation buttons*/}
//       <div className="flex items-center justify-center gap-4 mt-4">
//         <ButtonGroup variant="contained" color="primary">
//           <Button
//             onClick={() => {
//               router.push("/dashboard")
//             }}
//           >
//             Back
//           </Button>
//           <Button onClick={handleResetForm}>Clear</Button>
//           <Button type="submit">Submit</Button>
//         </ButtonGroup>
//       </div>
//     </Box>
//   )
// }

// export default CreateUser
