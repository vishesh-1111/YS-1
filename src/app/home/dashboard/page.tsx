"use client"
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
import { useQuery } from "@tanstack/react-query";
import RenderPieChart from "./compoents/piechart";
import RenderBarChart from "./compoents/barchart";
import RenderSummaryCards from "./compoents/summaycards"
import RenderRecentTransactions from './compoents/recent_transactions'
import RenderComparisionBarChart from "./compoents/comparisionbarchart";
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


async function fetchbudgets(){
  const response = await fetch(`${serverUrl}/budgets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch budgets: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.budgets;
}


export default function RenderDashboard(){
  console.log('fetching..');
  const { data:transactiondata, isLoading:isLoadingTransaction } = useQuery({
    refetchOnMount : false,
    queryKey: ["transactions"],
    queryFn: fetchtransactions, 
    staleTime: 60*30*1000, 
  });
  const { data:budgetdata, isLoading:isLoadingBudget } = useQuery({
    refetchOnMount : false,
    queryKey: ["budgets"],
    queryFn: fetchbudgets, 
    staleTime: 60*30*1000, 
  });
  

  if(isLoadingTransaction||isLoadingBudget){
    return(
      <div>
        Loading..
      </div>
    )
  }

   console.log(transactiondata)
  return(
    <div className="mt-4 mb-4">

 <div className="ml-10 lg:ml-80 grid grid-cols-1 lg:grid-cols-2 gap-4  justify-between items-center mb-4">
  <div className="col-span-2">
    <RenderSummaryCards transactiondata={transactiondata} />
  </div>

  <div className="mt-6">
    <RenderPieChart />
  </div>
  <div >
    <RenderBarChart />
  </div>
</div>

 <div className="ml-10 lg:ml-80">

  <div>
    <RenderRecentTransactions transactiondata={transactiondata} />
  </div>
  


  <div className="col-span-2 mt-3">
    <RenderComparisionBarChart budgetdata={budgetdata} transactiondata={transactiondata} />
    </div>
 </div>
  </div>
  )
}
