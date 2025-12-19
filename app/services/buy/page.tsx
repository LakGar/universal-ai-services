"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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

const products = [
  {
    id: 1,
    name: "Industrial Robot Arm Pro",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    alt: "Industrial Robot Arm Pro",
    price: "From $45,999",
    monthlyPrice: "or $1,916.62/mo. for 24 mo.",
    colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
    isNew: true,
  },
  {
    id: 2,
    name: "Autonomous Delivery Bot",
    image:
      "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800&q=80",
    alt: "Autonomous Delivery Bot",
    price: "From $29,999",
    monthlyPrice: "or $1,249.96/mo. for 24 mo.",
    colors: ["#ffffff", "#000000", "#3b82f6", "#10b981"],
    isNew: true,
  },
  {
    id: 3,
    name: "AI-Powered Assistant",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    alt: "AI-Powered Assistant",
    price: "From $19,999",
    monthlyPrice: "or $833.29/mo. for 24 mo.",
    colors: ["#8b5cf6", "#ec4899", "#06b6d4", "#000000"],
    isNew: true,
  },
  {
    id: 4,
    name: "Medical Robot System",
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
    alt: "Medical Robot System",
    price: "From $89,999",
    monthlyPrice: "or $3,749.96/mo. for 24 mo.",
    colors: ["#ffffff", "#3b82f6", "#10b981"],
    isNew: false,
  },
  {
    id: 5,
    name: "Warehouse Automation Bot",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    alt: "Warehouse Automation Bot",
    price: "From $34,999",
    monthlyPrice: "or $1,458.29/mo. for 24 mo.",
    colors: ["#f59e0b", "#ef4444", "#000000"],
    isNew: false,
  },
  {
    id: 6,
    name: "Service Robot",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    alt: "Service Robot",
    price: "From $24,999",
    monthlyPrice: "or $1,041.62/mo. for 24 mo.",
    colors: ["#ffffff", "#3b82f6", "#10b981", "#f59e0b"],
    isNew: false,
  },
];

const categories = [
  "All Models",
  "Industrial Robots",
  "Service Robots",
  "Medical Robots",
  "Educational Robots",
  "Consumer Robots",
  "Accessories",
];

export default function BuyPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All Models");

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
                <BreadcrumbPage>Buy</BreadcrumbPage>
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
              Shop Robots
            </h1>
            <p className="text-lg text-black/70 dark:text-white/70">
              All models. Take your pick.
            </p>
          </motion.div>

          <div
            className="mb-8 overflow-x-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="flex gap-4 min-w-max pb-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    selectedCategory === category
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
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
