import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Rocket, FileText, Link2, Key, BookOpen, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const menuItems = [
  {
    title: "Getting Started",
    url: "/dashboard",
    icon: Rocket,
  },
  {
    title: "Post History",
    url: "/dashboard/post-history",
    icon: FileText,
  },
  {
    title: "Connections",
    url: "/dashboard/connections",
    icon: Link2,
  },
  {
    title: "API Keys",
    url: "/dashboard/api-keys",
    icon: Key,
  },
  {
    title: "Documentation",
    url: "/docs",
    icon: BookOpen,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b-2 border-black p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#A6FAFF] border-2 border-black flex items-center justify-center">
            <div className="w-6 h-6 bg-[#79F7FF] border border-black transform rotate-45"></div>
          </div>
          <span className="text-xl font-black">Widya Social</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-[#FFE66D] hover:border-2 hover:border-black transition-all">
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t-2 border-black p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-red-600 hover:bg-red-50 hover:border-2 hover:border-black transition-all">
              <button className="flex items-center gap-3 px-3 py-2 w-full">
                <LogOut className="w-5 h-5" />
                <span className="font-bold">Sign Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}