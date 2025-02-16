"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// import { TaskForm } from "./inputform"
import { EditForm } from "./editform"

import { Button } from "@/components/ui/button"
import { Plus,EditIcon } from "lucide-react"
import React, { useState } from "react"

export default function RenderEditTask({transaction}:{transaction:any}) {
  const [open, setOpen] = useState(false) // Manage modal state
  
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-1">
            <EditIcon />
            Edit Transaction
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task</DialogTitle>
            <DialogDescription>
              Edit a transaction by entering the following details.
            </DialogDescription>
          </DialogHeader>
          <EditForm transaction={transaction} closeModal={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
