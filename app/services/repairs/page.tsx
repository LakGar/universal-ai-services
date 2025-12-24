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
import serviceData from "@/app/data.json";

// Transform repair services to ProductCard format
const transformRepairs = () => {
  const repairImages = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  ];

  return serviceData.services.map((service, index) => {
    const hourlyPrice = service.pricing?.hourly_usd;
    const depositPercent = service.pricing?.deposit_percent;
    
    let price = "Contact for quote";
    let monthlyPrice = service.warranty ? `${service.warranty} warranty` : "";
    
    if (hourlyPrice) {
      price = `$${hourlyPrice}/hour`;
      monthlyPrice = depositPercent 
        ? `${depositPercent}% deposit • ${service.warranty || ""} warranty`
        : service.warranty || "";
    } else if (service.pricing?.model) {
      price = service.pricing.model;
    }

    return {
      id: service.id,
      name: service.name,
      image: repairImages[index % repairImages.length],
      alt: service.name,
      price,
      monthlyPrice: monthlyPrice || service.region || "",
      isNew: false,
    };
  });
};

const repairServices = transformRepairs();

export default function RepairsPage() {
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
                <BreadcrumbPage>Repairs</BreadcrumbPage>
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
              Robot Repairs & Services
            </h1>
            <p className="text-lg text-black/70 dark:text-white/70">
              Expert repair services and support for all robot models.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {repairServices.map((service) => (
              <ProductCard
                key={service.id}
                id={service.id}
                name={service.name}
                image={service.image}
                alt={service.alt}
                price={service.price}
                monthlyPrice={service.monthlyPrice}
                isNew={service.isNew}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

