"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"
import { useQueryClient } from "@tanstack/react-query"

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


type Transaction = {
  amount: number
  category: "rent" | "grocery" | "utility" | "transportation"
}

type CategoryTotals = Record<string, number>

type ChartData = {
  category: string
  amount: number
  fill: string
}[]

const categoryColors: Record<Transaction["category"], string> = {
  rent: "hsl(var(--chart-1))",
  grocery: "hsl(var(--chart-2))",
  utility: "hsl(var(--chart-3))",
  transportation: "hsl(var(--chart-4))",
}

export default function RenderPieChart() {
  const queryClient = useQueryClient()
  const transactions: Transaction[] = queryClient.getQueryData(["transactions"]) || []
  console.log('transactions',transactions);
  const categoryTotals: CategoryTotals = transactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount
    return acc
  }, {} as CategoryTotals)

  const chartData: ChartData = Object.keys(categoryTotals).map((category) => ({
    category,
    amount: categoryTotals[category],
    fill: categoryColors[category as Transaction["category"]],
  }))

  const chartConfig: ChartConfig = Object.keys(categoryColors).reduce((acc, category) => {
    acc[category] = {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      color: categoryColors[category as Transaction["category"]],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Transaction Pie Chart</CardTitle>
        <CardDescription>Overview of Expenses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {transactions.length === 0 ? (
          <div className="text-center">No Data Available</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="amount" hideLabel />}
              />
              <Pie data={chartData} dataKey="amount" nameKey="category">
                <LabelList
                  dataKey="category"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
      
        <div className="leading-none text-muted-foreground">
          Showing total expenses across categories
        </div>
      </CardFooter>
    </Card>
  )
}
