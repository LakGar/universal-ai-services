"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProductCard } from "@/components/ui/product-card";
import { CartIcon } from "@/components/cart-icon";
import { WishlistIcon } from "@/components/wishlist-icon";

const accessories = [
  {
    id: 1,
    name: "Robot Gripper Kit",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    alt: "Robot Gripper Kit",
    price: "From $299",
    monthlyPrice: "Compatible with all models",
    colors: ["#3b82f6", "#ef4444", "#10b981"],
    isNew: true,
  },
  {
    id: 2,
    name: "Extended Battery Pack",
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80",
    alt: "Extended Battery Pack",
    price: "From $199",
    monthlyPrice: "Up to 12 hours runtime",
    colors: ["#000000", "#3b82f6"],
    isNew: true,
  },
  {
    id: 3,
    name: "Vision Sensor Module",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    alt: "Vision Sensor Module",
    price: "From $599",
    monthlyPrice: "4K resolution support",
    colors: ["#8b5cf6", "#06b6d4"],
    isNew: false,
  },
  {
    id: 4,
    name: "Wireless Charging Station",
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80",
    alt: "Wireless Charging Station",
    price: "From $449",
    monthlyPrice: "Fast charging enabled",
    colors: ["#ffffff", "#3b82f6"],
    isNew: false,
  },
  {
    id: 5,
    name: "Protective Cover Set",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    alt: "Protective Cover Set",
    price: "From $149",
    monthlyPrice: "Weather resistant",
    colors: ["#f59e0b", "#ef4444", "#000000"],
    isNew: false,
  },
  {
    id: 6,
    name: "AI Processing Unit",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    alt: "AI Processing Unit",
    price: "From $899",
    monthlyPrice: "Enhanced AI capabilities",
    colors: ["#ffffff", "#3b82f6", "#10b981"],
    isNew: false,
  },
];

export default function AccessoriesPage() {
  return (
    <>
      <header 
        className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
        style={{
          left: "var(--sidebar-width, 19rem)",
          right: 0,
        }}
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/services">Services</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Accessories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <WishlistIcon />
          <CartIcon />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-20 min-w-0">
        <div className="w-full min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-semibold mb-2 text-black dark:text-white">
              Robot Accessories
            </h1>
            <p className="text-lg text-black/70 dark:text-white/70">
              Enhance your robots with premium accessories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accessories.map((accessory) => (
              <ProductCard
                key={accessory.id}
                id={accessory.id}
                name={accessory.name}
                image={accessory.image}
                alt={accessory.alt}
                price={accessory.price}
                monthlyPrice={accessory.monthlyPrice}
                colors={accessory.colors}
                isNew={accessory.isNew}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

