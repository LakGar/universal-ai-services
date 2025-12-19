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

const rentalProducts = [
  {
    id: 1,
    name: "Industrial Robot Arm Pro",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    alt: "Industrial Robot Arm Pro",
    price: "From $2,999/mo",
    monthlyPrice: "Minimum 3 month rental",
    colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
    isNew: true,
  },
  {
    id: 2,
    name: "Autonomous Delivery Bot",
    image:
      "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800&q=80",
    alt: "Autonomous Delivery Bot",
    price: "From $1,999/mo",
    monthlyPrice: "Minimum 3 month rental",
    colors: ["#ffffff", "#000000", "#3b82f6", "#10b981"],
    isNew: true,
  },
  {
    id: 3,
    name: "AI-Powered Assistant",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    alt: "AI-Powered Assistant",
    price: "From $1,299/mo",
    monthlyPrice: "Minimum 3 month rental",
    colors: ["#8b5cf6", "#ec4899", "#06b6d4", "#000000"],
    isNew: false,
  },
  {
    id: 4,
    name: "Medical Robot System",
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
    alt: "Medical Robot System",
    price: "From $4,999/mo",
    monthlyPrice: "Minimum 6 month rental",
    colors: ["#ffffff", "#3b82f6", "#10b981"],
    isNew: false,
  },
  {
    id: 5,
    name: "Warehouse Automation Bot",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    alt: "Warehouse Automation Bot",
    price: "From $2,499/mo",
    monthlyPrice: "Minimum 3 month rental",
    colors: ["#f59e0b", "#ef4444", "#000000"],
    isNew: false,
  },
  {
    id: 6,
    name: "Service Robot",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    alt: "Service Robot",
    price: "From $1,499/mo",
    monthlyPrice: "Minimum 3 month rental",
    colors: ["#ffffff", "#3b82f6", "#10b981", "#f59e0b"],
    isNew: false,
  },
];

export default function RentPage() {
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
                <BreadcrumbPage>Rent</BreadcrumbPage>
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
              Rent Robots
            </h1>
            <p className="text-lg text-black/70 dark:text-white/70">
              Flexible rental options for your business needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rentalProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                alt={product.alt}
                price={product.price}
                monthlyPrice={product.monthlyPrice}
                colors={product.colors}
                isNew={product.isNew}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

