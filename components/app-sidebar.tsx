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
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { ConsultationModal } from "@/components/consultation-modal";
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = React.useState(false);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
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

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Get Help"
                  onClick={() => setIsConsultationModalOpen(true)}
                >
                  <HelpCircle />
                  <span>Get Help</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <ConsultationModal
      isOpen={isConsultationModalOpen}
      onClose={() => setIsConsultationModalOpen(false)}
    />
    </>
  );
}
