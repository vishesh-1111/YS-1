"use client"
import { useRouter} from "next/navigation";
import Link from "next/link";
import { Calendar, Home, Inbox, Search, Settings ,ChevronUp} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

console.log('hi');
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/home/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/home/inbox",
    icon: Inbox,
  },
  // {
  //   title: "Today",
  //   url: "/home/today",
  //   icon: Calendar,
  // },
  // {
  //   title: "Upcoming",
  //   url: "/home/upcoming",
  //   icon: Search,
  // },
  // {
  //   title: "Settings",
  //   url: "/home/settings",
  //   icon: Settings,
  // },
]
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;


export function AppSidebar() {
  const router = useRouter();
  const LogoutHandler = ()=>{
    fetch(`${serverUrl}/logout`,{
      method : "GET",
      credentials: "include",
    })
    router.push("/");
  }
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="underline">Transactify</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    User
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={LogoutHandler}>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
