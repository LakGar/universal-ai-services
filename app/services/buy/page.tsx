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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ProductCard } from "@/components/ui/product-card";
import { CartIcon } from "@/components/cart-icon";
import { WishlistIcon } from "@/components/wishlist-icon";
import buyData from "./data/buy_data.json";

// Type for product data
interface ProductData {
  id: number;
  productId: string;
  name: string;
  image: string;
  alt: string;
  price: string;
  monthlyPrice?: string;
  category: string;
  isNew: boolean;
  manufacturer: string;
  description: string;
}

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  if (typeof url !== "string") return false;
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Helper function to extract file ID from Google Drive URL
const extractFileId = (url: string): string | null => {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
};

// Helper function to get image from Google Drive or use provided images
const getProductImage = (item: any): string => {
  // If Images field exists and has URLs, use the first one
  if (item.Images && Array.isArray(item.Images) && item.Images.length > 0) {
    const firstImage = item.Images[0];
    // Skip if it's a video
    if (typeof firstImage === "string" && !isVideoUrl(firstImage)) {
      return firstImage;
    }
  }
  if (
    item.Images &&
    typeof item.Images === "string" &&
    !isVideoUrl(item.Images)
  ) {
    return item.Images;
  }

  // Check if Location ID is an array of Google Drive links
  const locationId = item["Location ID"];
  if (Array.isArray(locationId) && locationId.length > 0) {
    // Find first non-video item
    for (const link of locationId) {
      if (typeof link === "string") {
        // Skip videos
        if (isVideoUrl(link)) continue;

        if (link.includes("drive.google.com")) {
          const fileId = extractFileId(link);
          if (fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
          }
        } else if (link.startsWith("http")) {
          // Direct image URL
          return link;
        }
      }
    }
  }

  // Try to extract from single Google Drive link (string)
  if (
    typeof locationId === "string" &&
    locationId.includes("drive.google.com") &&
    !isVideoUrl(locationId)
  ) {
    const fileId = extractFileId(locationId);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  // Fallback to placeholder
  return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
};

// Transform JSON data to product format
const transformProducts = (): ProductData[] => {
  return buyData.map((item, index) => {
    const msrp = parseFloat(
      item.MSRP?.toString().replace(/[^0-9.]/g, "") || "0"
    );
    const price =
      msrp > 0 ? `From $${msrp.toLocaleString()}` : "Price on request";

    // Calculate monthly price (assuming 24 months)
    const monthlyPrice =
      msrp > 0
        ? `or $${(msrp / 24).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}/mo. for 24 mo.`
        : undefined;

    // Determine if product is new (released in 2024 or 2025)
    const releaseYear = parseInt(item["Release Year"] || "0");
    const isNew = releaseYear >= 2024;

    return {
      id: index + 1,
      productId: item["Product ID"] || `PROD-${index + 1}`,
      name: item["Model Name"] || "Unnamed Product",
      image: getProductImage(item),
      alt: item["Short Description"] || item["Model Name"] || "Product",
      price,
      monthlyPrice,
      category: item.Category || "Buy",
      isNew,
      manufacturer: item.Manufacturer || "",
      description: item.Description || item["Short Description"] || "",
    };
  });
};

const allProducts = transformProducts();

export default function BuyPage() {
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
        className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b transition-[left] duration-200 ease-linear"
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

          {allProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {allProducts.map((product: ProductData) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  alt={product.alt}
                  price={product.price}
                  monthlyPrice={product.monthlyPrice}
                  isNew={product.isNew}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
