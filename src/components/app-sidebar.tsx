"use client"

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
import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Getting Started",
    url: "/dashboard",
    icon: Rocket,
  },
  {
    title: "Post History",
    url: "/post-history",
    icon: FileText,
  },
  {
    title: "Connections",
    url: "/connections",
    icon: Link2,
  },
  {
    title: "API Keys",
    url: "/api-keys",
    icon: Key,
  },
  {
    title: "Documentation",
    url: "/docs",
    icon: BookOpen,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar>
      <SidebarHeader className="border-b-2 border-black p-4">
        <div className="flex items-center gap-3">

          <Image src="/autoposting.svg" alt="Logo" width={25} height={25} />
          <span className="text-xl font-black">AutoPosting.my.id</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:border-2 hover:border-black transition-all">
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="w-5 h-5" />
                        <span className={`font-medium ${isActive ? 'underline decoration-4 underline-offset-4' : ''}`}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-black p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-red-600 hover:bg-red-50 hover:border-2 hover:border-black transition-all">
              <button onClick={() => signOut({ redirect: false })} className="flex items-center gap-3 px-3 py-2 w-full cursor-pointer">
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