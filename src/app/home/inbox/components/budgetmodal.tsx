"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { BudgetForm } from "./budgetform"

import { Button } from "@/components/ui/button"
import {DollarSignIcon} from "lucide-react"
import React, { useState } from "react"

export default function RenderBudgetModal() {
  const [open, setOpen] = useState(false) 
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-1">
           <DollarSignIcon/>
             Set Monthly Budget
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Budget</DialogTitle>
            <DialogDescription>
              Set budget by entering the following details.
            </DialogDescription>
          </DialogHeader>
          <BudgetForm closeModal={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
