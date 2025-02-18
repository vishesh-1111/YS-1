"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import RenderAddTask from "./components/inputmodal";
import RenderBudgetModal from "./components/budgetmodal";
import { Task, getColumns } from "./columns";
import { DataTable } from "./data-table";
import "./components/data";
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

async function fetchtransactions() {
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

export default function DemoPage() {
  const spendingInsights = [
    "Track your monthly subscriptions - Regularly review and cancel unused or unnecessary subscriptions to avoid wasteful spending.",
    "Prioritize essential expenses - Focus on needs (like housing, food, and utilities) before discretionary spending (like entertainment or luxury items).",
    "Cut down on dining out - Cooking meals at home can save a significant amount of money compared to dining at restaurants.",
    "Look for recurring charges - Identify charges like memberships or fees that are regularly deducted and assess if they’re still valuable.",
    "Avoid impulse purchases - Take time to think about purchases and avoid making decisions based on emotional impulses.",
    "Use cashback and rewards - Leverage credit cards or apps that provide cashback or reward points for your spending.",
    "Set a budget for non-essentials - Establish a limit for non-essential spending to avoid overspending on things like gadgets or clothes.",
    "Automate savings - Set up automatic transfers to a savings account as soon as you receive your income to prioritize saving.",
    "Buy in bulk - Purchasing products like toiletries, cleaning supplies, and non-perishable food in bulk can save you money in the long run.",
    "Shop for discounts - Always look for sales, coupons, or promo codes before making any purchases."
  ];

  const randomInsight = spendingInsights[Math.floor(Math.random() * spendingInsights.length)];
  const { data: taskData, error, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchtransactions,
    staleTime: 1000 * 60 * 30,
  });

  const queryClient = useQueryClient();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching transactions: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={getColumns(queryClient)} data={taskData} />

      <div className="flex gap-4">
        <RenderAddTask />
        <RenderBudgetModal />
      </div>

      <div className="mt-10 p-6 bg-blue-500 text-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold">Spending Insight</h3>
        <p className="mt-4 text-lg">{randomInsight}</p>
      </div>
    </div>
  );
}
