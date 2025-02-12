"use client"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import RenderEditTask from "./components/editmodal"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../../components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "../../../components/ui/checkbox"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { EditForm } from "./components/editform"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Plus } from "lucide-react"

export type Task = {
  title: string
  description: string,
  status: string,
  _id :string

}

export const Columns: ColumnDef<Task>[] = [
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
          accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "title",
    header: "title"
  },
  {
    accessorKey: "description",
    header: "description",
    
  },
{
  id: "actions",
  cell: ({ row }) => {
    const task = row.original;
    
    const Actions = () => {
      const queryClient = useQueryClient(); // Correctly initialize here
      const [open, setOpen] = useState(false); // Manage modal state

      const taskDeleteHandler = async () => {
        console.log(task);
        await fetch(`http://localhost:5000/tasks/${task._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      };



      return (
        <>

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
          <RenderEditTask task={row.original}></RenderEditTask>
             
              <DropdownMenuItem onClick={taskDeleteHandler}>
                <div className="text-red-500">Delete</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </>
      )
    }
    return <Actions />;
  },
}
]
