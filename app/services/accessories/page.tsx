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
import accessoryData from "@/app/data.json";

// Transform accessories data to ProductCard format
const transformAccessories = () => {
  const accessoryImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  ];

  return accessoryData.accessories_addons.map((accessory, index) => {
    const priceUsd = accessory.pricing?.price_usd;
    const pricingModel = accessory.pricing?.model;

    let price = "Contact for pricing";
    let monthlyPrice = accessory.category || accessory.deployment || "";

    if (priceUsd) {
      price = `$${priceUsd.toLocaleString()}`;
      monthlyPrice = accessory.category || accessory.deployment || "";
    } else if (pricingModel) {
      price = pricingModel;
    }

    return {
      id: accessory.id,
      name: accessory.name,
      image: accessoryImages[index % accessoryImages.length],
      alt: accessory.name,
      price,
      monthlyPrice: monthlyPrice || accessory.provider || "",
      isNew: false,
    };
  });
};

const accessories = transformAccessories();

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {accessories.map((accessory) => (
              <ProductCard
                key={accessory.id}
                id={accessory.id}
                name={accessory.name}
                image={accessory.image}
                alt={accessory.alt}
                price={accessory.price}
                monthlyPrice={accessory.monthlyPrice}
                isNew={accessory.isNew}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
