"use client"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react";

export default function SetDataComponent({tasks}){
  const queryClient = useQueryClient();

  queryClient.setQueryData(["tasks"],tasks);
    useState(()=>{

       
       
    },[tasks])
  
    return null;
} 