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

// Helper function to extract file ID from Google Drive URL
const extractFileId = (url: string): string | null => {
  if (typeof url !== "string") return null;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  return null;
};

// Helper function to convert Google Drive URL to direct image URL
const getImageUrl = (url: string): string => {
  if (typeof url !== "string") {
    return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
  }

  if (url.includes("drive.google.com")) {
    const fileId = extractFileId(url);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  // If it's already a direct URL, return it
  if (url.startsWith("http")) {
    return url;
  }

  // Fallback
  return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
};

// Transform accessories data to ProductCard format
const transformAccessories = () => {
  return accessoryData.accessories_addons.map((accessory) => {
    // Get first image from images array
    let imageUrl =
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
    if (
      accessory.images &&
      Array.isArray(accessory.images) &&
      accessory.images.length > 0
    ) {
      imageUrl = getImageUrl(accessory.images[0]);
    }

    // Extract pricing information
    let price = "Contact for pricing";
    let monthlyPrice = "";

    // Check MSRP first (skip if it says "Contact Micro-IP" or "N/A")
    if (
      accessory.MSRP &&
      accessory.MSRP !== "Contact Micro-IP" &&
      accessory.MSRP !== "N/A" &&
      typeof accessory.MSRP === "string"
    ) {
      const msrpValue = parseFloat(accessory.MSRP.replace(/[^0-9.]/g, ""));
      if (msrpValue > 0 && !isNaN(msrpValue)) {
        price = `$${msrpValue.toLocaleString()}`;
      }
    }

    // Check UAIS Price (skip if it says "N/A")
    if (
      accessory["UAIS Price"] &&
      accessory["UAIS Price"] !== "N/A" &&
      price === "Contact for pricing"
    ) {
      const uaisPrice = accessory["UAIS Price"].toString();
      if (uaisPrice.includes("$")) {
        price = uaisPrice;
      } else {
        const uaisValue = parseFloat(uaisPrice.replace(/[^0-9.]/g, ""));
        if (uaisValue > 0 && !isNaN(uaisValue)) {
          price = `$${uaisValue.toLocaleString()}`;
        }
      }
    }

    // If MSRP says "Contact Micro-IP", keep "Contact for pricing"
    if (accessory.MSRP === "Contact Micro-IP") {
      price = "Contact for pricing";
    }

    // Set monthly price based on manufacturer or category (skip Micro-IP)
    if (accessory.Manufacturer && accessory.Manufacturer !== "Micro-IP") {
      monthlyPrice = accessory.Manufacturer;
    } else if (accessory["Short Description"]) {
      monthlyPrice = accessory["Short Description"];
    }

    // Determine if product is new (released in 2024 or 2025)
    const releaseYear = parseInt(accessory["Release Year"] || "0");
    const isNew = releaseYear >= 2024;

    return {
      id: accessory["Product ID"] || accessory.SKU || accessory.name,
      name: accessory.name,
      image: imageUrl,
      alt: accessory["Short Description"] || accessory.name,
      price,
      monthlyPrice,
      isNew,
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
                linkPath={`/services/accessories/${accessory.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
