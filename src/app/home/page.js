"use client";
import { Router, useRouter } from "next/navigation";
import { useEffect, } from "react";


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
