"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { Monitor } from "lucide-react"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
// } satisfies ChartConfig
// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     icon: Monitor,
//     // A color like 'hsl(220, 98%, 61%)' or 'var(--color-name)'
//     color: "#2563eb",
//     // OR a theme object with 'light' and 'dark' keys
//     theme: {
//       light: "#2563eb",
//       dark: "#dc2626",
//     },
//   },
// } satisfies ChartConfig

const chartConfig = {
  desktop: {
    label: "Transactions: ",
    color: "#2563eb",
  },
} satisfies ChartConfig
  function RenderBarChart() {
  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>Monthly Transactions</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>

        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartLegend content={<ChartLegendContent />} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Transaction Frequency/Month <TrendingUp className="h-4 w-4" />
        </div>
     
      </CardFooter>
    </Card>
  )
}

export default function RenderDashboard(){
  return(
    <div>
      <RenderBarChart/>
    </div>
  )
}
