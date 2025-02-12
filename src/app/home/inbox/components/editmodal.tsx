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
import { Plus } from "lucide-react"
import React, { useState } from "react"

export default function RenderEditTask({task}:{task:any}) {
  const [open, setOpen] = useState(false) // Manage modal state

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-1">
            <Plus />
            Edit Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task</DialogTitle>
            <DialogDescription>
              Edit a task by entering the following details.
            </DialogDescription>
          </DialogHeader>
          <EditForm task={task} closeModal={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
