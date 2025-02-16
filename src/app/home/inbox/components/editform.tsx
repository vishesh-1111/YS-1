"use client"
import { useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

const formSchema = z.object({
  amount: z.coerce.number(),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
    date: z.date(),

})

interface EditFromProps {
  closeModal: () => void
}

export function EditForm({ transaction, closeModal }: any){
    console.log(transaction);
    const queryClient = useQueryClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values);
    try {
      const response = await fetch(`${serverUrl}/transactions/${transaction._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Failed to create transaction: ${response.statusText}`)
      }

      queryClient.invalidateQueries({
        queryKey : ["transactions"]
      }) // Refetch transactions
      closeModal() // Close the modal after successful submission
    } catch (error) {
      console.error("Error creating transaction:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Enter amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
           <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>date</FormLabel>
              <FormControl>
              <Input
                type="date"
                placeholder="Enter date"
                {...field}
                value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : ""}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
              />

              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
