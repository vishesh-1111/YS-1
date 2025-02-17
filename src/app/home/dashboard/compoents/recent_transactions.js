import {Star} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'


  function getClosestThreeDocuments(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return []; // Return an empty array if data is not valid
    }
  
    const today = new Date(); // Get today's date
    
    // Sort by absolute difference from today's date
    return data
      .map(item => ({
        ...item,
        dateDiff: Math.abs(new Date(item.date) - today) // Calculate time difference
      }))
      .sort((a, b) => a.dateDiff - b.dateDiff) // Sort by closest date
      .slice(0, 3); // Take the first 5 items
  }

export default function RenderRecentTransactions({data}){
    const recentTransactions = getClosestThreeDocuments(data)
    console.log('rec',recentTransactions);
    return (
        <Card className='col-span-1 lg:col-span-3'>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            Your  {recentTransactions.length} recent transactions .
          </CardDescription>
        </CardHeader>
        <CardContent>
     
        <div className="space-y-8">
  {recentTransactions.map((transaction, index) => (
    <div key={index} className="flex items-center gap-4">
      <Avatar className="h-9 w-9">
        <AvatarImage src="/avatars/01.png" alt="Avatar" />
        <AvatarFallback>
          <Star></Star>
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-wrap items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{transaction.category}</p>
          <p className="text-sm text-muted-foreground">{transaction.description}</p>
        </div>
        <div
          className={`font-medium ${
            transaction.amount >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {transaction.amount >= 0 ? `$${transaction.amount}` : `-$${Math.abs(transaction.amount)}`}
        </div>
      </div>
    </div>
  ))}
</div>

        </CardContent>
      </Card>
      )
}