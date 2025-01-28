import DashboardIcon from "@mui/icons-material/Dashboard"
import BarChartIcon from "@mui/icons-material/BarChart"
import DescriptionIcon from "@mui/icons-material/Description"
import LayersIcon from "@mui/icons-material/Layers"


const NAVIGATION = [
  {
    segment: "dashboard/users",
    title: "User Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "dashboard",
    title: "Analytics Dashboard",
    icon: <LayersIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: "dashboard",
    title: "Statistics Dashboard",
    icon: <LayersIcon />,
    children: [
      {
        segment: "chart",
        title: "Chart",
        icon: <BarChartIcon />,
      },
      {
        segment: "stats",
        title: "Stats",
        icon: <BarChartIcon />,
      },
    ],
  },
]

export { NAVIGATION }
