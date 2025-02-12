<<<<<<< Updated upstream
"use client"
import IndexPage from "../../../src-table/app/page"
export default function HomePage(){
    
   
    return(
        <div>
          Home page
        </div>
    )
}
=======
"use client";
import { Router, useRouter } from "next/navigation";
import { useEffect} from "react";


export default function HomePage() {
  const router = useRouter();
  useEffect(()=>{
    router.push('/home/inbox')

  },[router])

  return(
    <div>
      Loading....
    </div>
  )

}
>>>>>>> Stashed changes
