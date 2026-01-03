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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ProductCard } from "@/components/ui/product-card";
import { CartIcon } from "@/components/cart-icon";
import { WishlistIcon } from "@/components/wishlist-icon";
import serviceData from "@/app/data.json";

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
    return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80";
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
  return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80";
};

// Transform repair services to ProductCard format
const transformRepairs = () => {
  return serviceData.services.map((service) => {
    // Get first image from images array
    let imageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80";
    if (service.images && Array.isArray(service.images) && service.images.length > 0) {
      imageUrl = getImageUrl(service.images[0]);
    }

    // Extract pricing information from UAIS Price field
    let price = "Contact for quote";
    if (service["UAIS Price"] && service["UAIS Price"] !== "N/A") {
      const uaisPrice = service["UAIS Price"].toString();
      if (uaisPrice.includes("USD") || uaisPrice.includes("$")) {
        price = uaisPrice;
      } else {
        const priceValue = parseFloat(uaisPrice.replace(/[^0-9.]/g, ""));
        if (priceValue > 0 && !isNaN(priceValue)) {
          price = `$${priceValue.toLocaleString()}`;
        }
      }
    }

    // Build monthly price with warranty and deposit info
    let monthlyPrice = "";
    if (service.Warranty && service.Warranty !== "N/A") {
      monthlyPrice = service.Warranty;
    }
    
    // Add deposit info if available
    if (service["Deposit Required"] && service["Deposit Required"] !== "N/A" && service["Deposit Required"] !== "50% deposit") {
      if (monthlyPrice) {
        monthlyPrice += ` • ${service["Deposit Required"]}`;
      } else {
        monthlyPrice = service["Deposit Required"];
      }
    } else if (service["Deposit Required"] === "50% deposit") {
      if (monthlyPrice) {
        monthlyPrice += " • 50% deposit";
      } else {
        monthlyPrice = "50% deposit";
      }
    }

    // Add location info if available
    if (service["Version/Revision"]) {
      const location = service["Version/Revision"];
      if (location.includes("Bay Area") || location.includes("Los Angeles") || location.includes("LA")) {
        if (monthlyPrice) {
          monthlyPrice += ` • ${location}`;
        } else {
          monthlyPrice = location;
        }
      }
    }

    return {
      id: service["Product ID"] || service.SKU || service.name,
      name: service.name,
      image: imageUrl,
      alt: service["Short Description"] || service.name,
      price,
      monthlyPrice: monthlyPrice || "",
      isNew: false,
    };
  });
};

const repairServices = transformRepairs();

export default function RepairsPage() {
  const { state, isMobile } = useSidebar();

  // Calculate header left position based on sidebar state
  const getHeaderLeft = () => {
    if (isMobile) return "0";
    // When collapsed in icon mode with floating variant, sidebar is ~4rem (3rem icon + 1rem padding)
    // When expanded, sidebar is 19rem wide (from layout)
    return state === "collapsed" ? "4rem" : "19rem";
  };

  return (
    <>
      <header 
        className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-[left] duration-200 ease-linear"
        style={{
          left: getHeaderLeft(),
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
                linkPath={`/services/repairs/${service.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

