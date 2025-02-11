import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import QueryClientProviderComponent from '@/components/queryClientProvider/provider';

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EzTask",
  description: "Task Management App",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  
    return (
      <html lang="en">
        <body className="h-screen">
         <QueryClientProviderComponent>
          {children}
         </QueryClientProviderComponent>

        </body>
      </html>
    );
    };
