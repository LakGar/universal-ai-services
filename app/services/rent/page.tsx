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

// Helper function to extract file ID from Google Drive URL
const extractFileId = (url: string): string | null => {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
};

// Helper function to convert Google Drive URL to direct view URL
const convertGoogleDriveUrl = (url: string, isVideo: boolean = false): string => {
  if (!url || typeof url !== "string") return url;
  
  // If it's already a direct URL, return it
  if (url.includes("uc?export=view") || url.includes("uc?export=download") || url.includes("/preview")) {
    return url;
  }
  
  // If it's a Google Drive share link, convert it
  if (url.includes("drive.google.com")) {
    const fileId = extractFileId(url);
    if (fileId) {
      if (isVideo) {
        // For videos, use the preview URL (works better for embedded playback)
        return `https://drive.google.com/file/d/${fileId}/preview`;
      } else {
        // For images, use the view link
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
  }
  
  // Return as-is if it's already a direct URL
  return url;
};

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  if (typeof url !== "string") return false;
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Helper function to get the first image or video from arrays
const getProductImage = (rental: any): { url: string; isVideo: boolean } => {
  // Check if images array exists and has items
  if (rental.images && Array.isArray(rental.images) && rental.images.length > 0) {
    const firstImage = rental.images[0];
    if (typeof firstImage === "string") {
      return { url: convertGoogleDriveUrl(firstImage, false), isVideo: false };
    }
  }
  
  // If no images, check videos array
  if (rental.videos && Array.isArray(rental.videos) && rental.videos.length > 0) {
    const firstVideo = rental.videos[0];
    if (typeof firstVideo === "string") {
      return { url: convertGoogleDriveUrl(firstVideo, true), isVideo: true };
    }
  }
  
  // Fallback to placeholder
  return { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", isVideo: false };
};

// Transform rental data to ProductCard format
const transformRentals = () => {
  return rentalData.rentals.map((rental, index) => {
    // Get ID from various possible fields
    const id = rental.id || rental.SKU || rental["Product ID"] || `rental-${index}`;
    
    // Get name from various possible fields
    const name = rental.name || rental["Model Name"] || rental["Short Description"] || "Unnamed Rental";
    
    // Get pricing from various possible fields (same logic as detail page)
    const dailyPrice = rental.pricing?.daily_usd || 
                       parseFloat((rental["Rental Price (Daily)"] || "").toString().replace(/[^0-9.]/g, "")) || 
                       null;
    const depositAmount = parseFloat((rental["Deposit Required"] || "").toString().replace(/[^0-9.]/g, "")) || null;
    const depositPercent = rental.pricing?.deposit_percent || 
                           (depositAmount && dailyPrice ? Math.round((depositAmount / (dailyPrice * 30)) * 100 * 10) / 10 : 0);
    
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

    const { url: imageUrl, isVideo: imageIsVideo } = getProductImage(rental);
    
    // Get year from various possible fields
    const year = rental.year || parseInt(rental["Release Year"] || "0") || null;

    return {
      id,
      name,
      image: imageUrl,
      alt: name,
      price,
      monthlyPrice,
      isNew: year === 2025 || year === 2024,
      isVideo: imageIsVideo,
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
            {rentalProducts.map((product, index) => (
              <ProductCard
                key={product.id || `rental-${index}`}
                id={product.id || `rental-${index}`}
                name={product.name}
                image={product.image}
                alt={product.alt}
                price={product.price}
                monthlyPrice={product.monthlyPrice}
                isNew={product.isNew}
                isVideo={product.isVideo}
                linkPath={`/services/rent/${product.id || `rental-${index}`}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

