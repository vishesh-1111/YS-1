
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
// import "./globals.css";
import clsx from "clsx";
import { useState } from "react";
import {twMerge} from "tailwind-merge";
import { useQueryClient,QueryClient } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import  {AppSidebar}  from "@/components/ui/app-siderbar"
import { useRouter } from "next/navigation";


export const metadata: Metadata = {
  title: "EzTask",
  description: "Task Management App",
};
export default function Layout({ children }: { children: React.ReactNode }) {
   
    return (
      <div>
         <SidebarProvider>
        <AppSidebar />
         <SidebarTrigger />
        {children}
        </SidebarProvider>
      </div>
    );
    };
