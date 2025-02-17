"use client"
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
import { useQuery } from "@tanstack/react-query";
import RenderPieChart from "./compoents/piechart";
import RenderBarChart from "./compoents/barchart";
import RenderSummaryCards from "./compoents/summaycards"
import RenderRecentTransactions from './compoents/recent_transactions'
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
    // <div >

    // <div className="mt-4">
    //   <RenderSummaryCards></RenderSummaryCards>
    // </div>


    // <div>
    //   <RenderBarChart/>
    // </div>
    // <div className="mt-2 mb-2">
    //   <RenderPieChart></RenderPieChart>
    // </div>
    // </div>
<div className="ml-10 lg:ml-80">
<div className="mt-4">
    <RenderSummaryCards data={data} />
  </div>
 
  <div className="mt-4">
    <RenderRecentTransactions data={data}></RenderRecentTransactions>
  </div>
  <div >
    <RenderBarChart />
  </div>

  <div className="mt-2 mb-2">
    <RenderPieChart />
  </div>
 </div>
  )
}
