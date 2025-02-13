"use client";

import * as React from "react";
import { useQuery ,useQueryClient} from "@tanstack/react-query";
import RenderAddTask from "./components/inputmodal";
import { Task, getColumns } from "./columns";
import { DataTable } from "./data-table";
import "./components/data";
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
console.log(serverUrl);
async function fetchTasks(){
  const response = await fetch(`${serverUrl}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  const data = await response.json();
  return data.tasks;
}

export default function DemoPage() {
  const { data: taskData, error, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
  const queryClient = useQueryClient();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching tasks: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable  columns={getColumns(queryClient)} data={taskData} />
      <RenderAddTask />
    </div>
  );
}
