"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { TaskForm } from "./inputform"
import { EditForm } from "./editform"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import React, { useState } from "react"

export default function RenderAddTask() {
  const [open, setOpen] = useState(false) // Manage modal state

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-1">
            <Plus />
            Add Transaction
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction</DialogTitle>
            <DialogDescription>
              Add a transaction by entering the following details.
            </DialogDescription>
          </DialogHeader>
          <TaskForm closeModal={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
