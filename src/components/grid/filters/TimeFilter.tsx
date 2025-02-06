import React from "react"
import { Select, MenuItem } from "@mui/material"

type TimeFilterProps = {
  timeFilter: string
  onTimeFilterChange: (value: string) => void
}

export const TimeFilter: React.FC<TimeFilterProps> = ({
  timeFilter,
  onTimeFilterChange,
}) => {
  return (
    <Select
      value={timeFilter}
      onChange={e => onTimeFilterChange(e.target.value)}
      sx={{ minWidth: 150 }}
    >
      <MenuItem value="all">All Time</MenuItem>
      <MenuItem value="today">Today</MenuItem>
      <MenuItem value="thisWeek">Last 7 Days</MenuItem>
      <MenuItem value="last30Days">Last 30 Days</MenuItem>
    </Select>
  )
}
