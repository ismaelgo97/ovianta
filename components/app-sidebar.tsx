"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const sidebarItems = [
  { title: "Home", url: "/" },
  { title: "Patients", url: "/patients" },
  { title: "Appointments", url: "/appointments" },
  { title: "Calendar", url: "/calendar" },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [activePath, setActivePath] = React.useState(pathname ?? "/")

  React.useEffect(() => {
    if (pathname) {
      setActivePath(pathname)
    }
  }, [pathname])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className="text-2xl font-bold">Ovianta</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={activePath === item.url}
                    onClick={() => setActivePath(item.url)}
                  >
                    <Link href={item.url}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
