import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
  function getMonthWithHighestSum(transactions) {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return null; // Return null if input is invalid or empty
    }
  
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
  
    const monthSums = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const month = date.getMonth(); // Get month index (0-11)
  
      acc[month] = (acc[month] || 0) + transaction.amount;
      return acc;
    }, {});
  
    // Find the month with the highest sum
    const maxMonthIndex = Object.entries(monthSums).reduce((max, curr) =>
      curr[1] > max[1] ? curr : max
    )[0];
  
    return monthNames[maxMonthIndex]; // Convert index to month name
  }
  function getFutureTransactions(transactions) {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return []; // Return an empty array if input is invalid
    }
  
    const now = new Date(); // Get current date and time
  
    return transactions.filter(transaction => new Date(transaction.date) > now);
  }
  
  function getTotalExpenses(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return 0; // Return 0 if the input is not a valid array or is empty
    }
  
    return data.reduce((total, item) => total + (item.amount || 0), 0);
  }
  
  function getMaxAmount(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return null; // Return null if the input is not a valid array or is empty
    }
    
    return Math.max(...data.map(item => item.amount));
  }
  
export default function RenderSummaryCards({data}){
   const mxamnt = getMaxAmount(data)
   const totamnt= getTotalExpenses(data)
   const futuretransactions = getFutureTransactions(data)
   const mostnusymonth = getMonthWithHighestSum(data);
    return(
        <>
     <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
         <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Expenses
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>${totamnt}</div>
                  <p className='text-xs text-muted-foreground'>
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Transactions
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{data.length}</div>
                  <p className='text-xs text-muted-foreground'>
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Most Busy Month</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{mostnusymonth}</div>
                  <p className='text-xs text-muted-foreground'>
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Active Now
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+{futuretransactions.length}</div>
                  <p className='text-xs text-muted-foreground'>
                    +201 
                  </p>
                </CardContent>
              </Card>
            </div>
            </>
    )
}