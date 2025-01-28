"use client"

import { BarChart } from "@mui/x-charts/BarChart"
import { LineChart } from "@mui/x-charts/LineChart"
import { PieChart } from "@mui/x-charts/PieChart"

function Charts() {
  return (
    <div className="flex flex-col space-between justify-center m-auto">
      <h1 className="text-3xl text-gray-700 justify-center m-auto pt-2">Charts</h1>
      <div className="flex flex-col items-center gap-8 m-auto min-w-full md:flex-row">

        {/* Bar chart */}
        <BarChart
          xAxis={[
            { scaleType: "band", data: ["group A", "group B", "group C"] },
          ]}
          series={[
            { data: [4, 3, 5] },
            { data: [1, 6, 3] },
            { data: [2, 5, 6] },
          ]}
          width={500}
          height={300}
        />

        {/* Pie chart */}
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: "series A" },
                { id: 1, value: 15, label: "series B" },
                { id: 2, value: 20, label: "series C" },
              ],
            },
          ]}
          width={400}
          height={200}
        />
      </div>

      <div className="flex m-auto">
        {/* Line chart */}
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          width={500}
          height={300}
        />
      </div>
    </div>
  )
}

export default Charts
