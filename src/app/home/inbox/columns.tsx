//@ts-nocheck
"use client"
import { useQueryClient } from "@tanstack/react-query"
import { Checkbox } from "../../../components/ui/checkbox"
import { Button } from "../../../components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { ColumnDef, StringHeaderIdentifier } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import RenderEditTask from "./components/editmodal"
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export type Task = {
  amount: Number
  description: string
  data: string
  _id : string
}

export function getColumns(queryClient: ReturnType<typeof useQueryClient>): ColumnDef<Task>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "amount",
      header: () => <div className="text">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className=" font-medium">{formatted}</div>
    },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "date",
      header: () => <div className="text">date</div>,
      cell: ({ row }) => {
        const date = (row.getValue("date"))
        
        const formatted = date.split("T")[0];
        return <div className=" font-medium">{formatted}</div>
    },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const TransactionDeletHandler = async () => {
          const transaction = row.original
          console.log(transaction)

          await fetch(`${serverUrl}/transactions/${transaction._id}`, {
            method: "DELETE",
            credentials: "include",
          })

          queryClient.invalidateQueries({ queryKey: ["transactions"] })
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <RenderEditTask transaction={row.original} />
              <DropdownMenuItem onClick={TransactionDeletHandler}>
                <div className="text-red-500">Delete</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
