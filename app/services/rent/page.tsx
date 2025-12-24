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
import rentalData from "@/app/data.json";

// Transform rental data to ProductCard format
const transformRentals = () => {
  const robotImages = [
    "https://images.unsplash.com/photo-1625314887424-9f190599bd56?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  ];

  return rentalData.rentals.map((rental, index) => {
    const dailyPrice = rental.pricing?.daily_usd;
    const depositPercent = rental.pricing?.deposit_percent || 0;
    
    let price = "Contact for pricing";
    let monthlyPrice = rental.availability || "";
    
    if (dailyPrice) {
      const monthlyEstimate = dailyPrice * 30;
      price = `From $${dailyPrice.toLocaleString()}/day`;
      monthlyPrice = monthlyEstimate > 0 
        ? `~$${Math.round(monthlyEstimate).toLocaleString()}/mo • ${depositPercent}% deposit`
        : rental.availability || "";
    } else if (rental.pricing?.model) {
      price = rental.pricing.model;
    }

    return {
      id: rental.id,
      name: rental.name,
      image: robotImages[index % robotImages.length],
      alt: rental.name,
      price,
      monthlyPrice,
      isNew: rental.year === 2025 || rental.year === 2024,
    };
  });
};

const rentalProducts = transformRentals();

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
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

