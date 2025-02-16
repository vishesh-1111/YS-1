"use client"
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

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
import {dataTagErrorSymbol, useQuery } from "@tanstack/react-query"
// will fetch from live user data 
// const chartData = [
//   { month: "January", transactions: 186 },
//   { month: "February", transactions: 305 },
//   { month: "March", transactions: 237 },
//   { month: "April", transactions: 73 },
//   { month: "May", transactions: 209 },
//   { month: "June", transactions: 214 },
// ]
type Transaction = {
  amount: number;
  date: string;
  description: string;
  _id: string;
};

type ChartData = {
  month: string;
  transactions: number;
};

function convertToMonthlyExpenses(transactions: Transaction[]): ChartData[] {
  const monthMap = new Map<string, number>();

  transactions.forEach(({ date, amount }) => {
    const monthName = new Date(date).toLocaleString("en-US", { month: "long" });

    // Add amount to the respective month's total
    monthMap.set(monthName, (monthMap.get(monthName) || 0) + amount);
  });

  // Convert Map to an array of objects
  return Array.from(monthMap, ([month, transactions]) => ({ month, transactions }));
}

// Example data
const transactions: Transaction[] = [
  { amount: 10, date: "2025-02-18T00:00:00.000Z", description: "Food", _id: "67b1de0d9e05d0f8579a12ea" },
  { amount: 2, date: "2025-03-06T00:00:00", description: "sdsf", _id: "67b1e82779124f4a00c426f3" },
  { amount: 2, date: "2025-02-25T00:00:00", description: "rrr", _id: "67b1e84979124f4a00c426f4" },
  { amount: 20, date: "2025-02-26T00:00:00", description: "csdsd", _id: "67b1e96a79124f4a00c426f" },
  { amount: 30, date: "2025-04-26T00:00:00", description: "csdsd", _id: "67b1e96a79124f4a00c426g" },
];

const chartData: ChartData[] = convertToMonthlyExpenses(transactions);
console.log(chartData);




async function fetchtransactions(){
  const response = await fetch(`${serverUrl}/transactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.transactions;
}

const chartConfig = {
  transactions: {
    label: "Transactions: ",
    color: "#2563eb",
  },
} satisfies ChartConfig

function RenderBarChart({data}:{data:any}) {
  return (
<Card  className="mt-10 ">
      
      <CardHeader>
        <CardTitle>Monthly Transactions</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="">

        <ChartContainer  config={chartConfig} className="mt-5" >
          <BarChart
            accessibilityLayer
            data={convertToMonthlyExpenses(data)}
            margin={{
              top: 20,
            }}
          >
            
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={12}
              axisLine={false}
              tickFormatter={(value) => value.slice(0,3)}
            />
            <CartesianGrid vertical={true} />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
            
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar   dataKey="transactions" fill="var(--color-transactions)" radius={8}>
              <LabelList
                
                position="top"
                offset={12}
                className="fill-foreground mt-5"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
           Expenses <TrendingUp className="h-4 w-4" />
        </div>
     
      </CardFooter>
    </Card>
  )
}

export default function RenderDashboard(){
  console.log('fetching..');
  const { data, isLoading } = useQuery({
    refetchOnMount : false,
    queryKey: ["transactions"],
    queryFn: fetchtransactions, 
    staleTime: 60*30*1000, 
  });
  

  if(isLoading){
    return(
      <div>
        Loading..
      </div>
    )
  }

   console.log(data)
  return(
    <div >
      <RenderBarChart data={data}/>
    </div>
  )
}
