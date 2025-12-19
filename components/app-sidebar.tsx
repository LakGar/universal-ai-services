"use client";

import * as React from "react";
import Image from "next/image";
import {
  Home,
  ShoppingCart,
  Receipt,
  Gift,
  Wrench,
  Calendar,
  Video,
  Megaphone,
  HelpCircle,
  Search,
  Settings,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
];

const marketplaceItems = [
  {
    title: "Buy",
    url: "/services/buy",
    icon: ShoppingCart,
  },
  {
    title: "Rent",
    url: "/services/rent",
    icon: Receipt,
  },
  {
    title: "Accessories",
    url: "/services/accessories",
    icon: Gift,
  },
  {
    title: "Repairs",
    url: "/services/repairs",
    icon: Wrench,
  },
];

const servicesItems = [
  {
    title: "Consultation",
    url: "/services/consultation",
    icon: Calendar,
  },
  {
    title: "Media",
    url: "/services/media",
    icon: Video,
  },
  {
    title: "Events",
    url: "/services/events",
    icon: Megaphone,
  },
];

const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Get Help",
    url: "#",
    icon: HelpCircle,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <Image
                  src="/logo.png"
                  alt="Universal AI Services"
                  width={32}
                  height={32}
                  className="dark:invert"
                />
                <span className="text-base font-semibold zalando-sans-expanded">
                  Universal AI Services
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />

        <SidebarGroup>
          <SidebarGroupLabel>Marketplace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {marketplaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {servicesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "Guest",
            email: "guest@example.com",
            avatar: "/logo.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
