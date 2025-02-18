"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useMemo } from "react";

// Utility function to get month name from date
const getMonthFromDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "long" }).toLowerCase();
};

// Converts budget data into required format
const convertBudgetData = (budgetdata: any[]) => {
  const budgetMap: Record<string, Record<string, number>> = {};

  budgetdata.forEach(({ category, month, budget }) => {
    if (!budgetMap[category]) {
      budgetMap[category] = {};
    }
    budgetMap[category][month] = budget;
  });

  return budgetMap;
};

// Converts transaction data to get actual expenses per month per category
const convertTransactionData = (transactiondata: any[]) => {
  const expenseMap: Record<string, Record<string, number>> = {};

  transactiondata.forEach(({ category, amount, date }) => {
    const month = getMonthFromDate(date);

    if (!expenseMap[category]) {
      expenseMap[category] = {};
    }

    expenseMap[category][month] = (expenseMap[category][month] || 0) + amount;
  });

  return expenseMap;
};

export default function RenderComparisonBarChart({
  budgetdata,
  transactiondata,
}: {
  budgetdata: any;
  transactiondata: any;
}) {
  const [selectedCategory, setSelectedCategory] = useState("grocery");

  // Convert data only once using useMemo
  const budgetMap = useMemo(() => convertBudgetData(budgetdata), [budgetdata]);
  const expenseMap = useMemo(
    () => convertTransactionData(transactiondata),
    [transactiondata]
  );

  // Generate chart data for selected category
  const chartData = useMemo(() => {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    return months.map((month) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1), // Capitalize first letter
      budget: budgetMap[selectedCategory]?.[month] || 0,
      actual: expenseMap[selectedCategory]?.[month] || 0,
    }));
  }, [selectedCategory, budgetMap, expenseMap]);

  const chartConfig: ChartConfig = {
    budget: {
      label: "Budget",
      color: "#000000", // Black
    },
    actual: {
      label: "Actual Expenses",
      color: "#2563eb",

    },
  } satisfies ChartConfig 


  return (
    <Card>
      <CardHeader>
        <div className="flex gap-5">
          <CardTitle className="mt-1">Budget vs. Actual Expenses</CardTitle>
            Select Category
          <div>
            <Select
              onValueChange={(value) => setSelectedCategory(value)}
              defaultValue={selectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="grocery">Grocery</SelectItem>
                <SelectItem value="utility">Utility</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription>Monthly Comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="budget" fill="var(--color-budget)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground mt-5"
                fontSize={8}
              />
            </Bar>
            <Bar dataKey="actual" fill="var(--color-actual)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground mt-5"
                fontSize={7}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Comparison Expenses <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
