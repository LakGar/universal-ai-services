"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
import { CartIcon } from "@/components/cart-icon";
import { WishlistIcon } from "@/components/wishlist-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Calendar } from "lucide-react";
import { AddOnConsultationModal } from "@/components/addon-consultation-modal";
import { useWishlist } from "@/contexts/wishlist-context";
import { cn } from "@/lib/utils";
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

interface AccessoryCardProps {
  accessory: ReturnType<typeof transformAccessories>[0];
  onConsultationClick: (
    accessory: ReturnType<typeof transformAccessories>[0]
  ) => void;
}

function AccessoryCard({ accessory, onConsultationClick }: AccessoryCardProps) {
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const inWishlist = isInWishlist(accessory.id);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [accessory.image]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(accessory.id);
    } else {
      addToWishlist({
        id: accessory.id,
        name: accessory.name,
        image: accessory.image,
        price: accessory.price,
        monthlyPrice: accessory.monthlyPrice,
      });
    }
  };

  const handleConsultationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConsultationClick(accessory);
  };

  return (
    <motion.div
      className="w-full flex flex-col gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors relative group h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/services/accessories/${accessory.id}`}
        className="block shrink-0"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 flex-1">
            {accessory.name}
          </h3>
          {/* {accessory.isNew && (
            <Badge variant="default" className="ml-2 shrink-0">
              New
            </Badge>
          )} */}
        </div>
        <div className="relative aspect-3/4 w-full rounded-lg overflow-hidden bg-muted cursor-pointer">
          {imageLoading && (
            <Skeleton className="absolute inset-0 w-full h-full z-10" />
          )}
          {!imageError && (
            <Image
              src={accessory.image}
              alt={accessory.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-cover transition-opacity duration-300 relative z-0",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
              <p className="text-sm">Image not available</p>
            </div>
          )}
        </div>
      </Link>
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "absolute top-16 right-6 opacity-0 transition-opacity group-hover:opacity-100 z-10",
          inWishlist && "opacity-100"
        )}
        onClick={handleWishlistToggle}
      >
        <Heart
          className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")}
        />
      </Button>
      <div className="flex flex-col gap-1 h-[3.5rem] flex-shrink-0">
        <p className="text-sm text-foreground font-medium line-clamp-1 h-5">
          {accessory.price}
        </p>
        {accessory.monthlyPrice ? (
          <p className="text-xs text-muted-foreground line-clamp-2 h-8">
            {accessory.monthlyPrice}
          </p>
        ) : (
          <div className="h-8" />
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0 mt-auto">
        <Button onClick={handleConsultationClick} className="flex-1">
          <Calendar className="w-4 h-4 mr-2" />
          Book a Consult
        </Button>
      </div>
    </motion.div>
  );
}

export default function AccessoriesPage() {
  const { state, isMobile } = useSidebar();
  const [selectedAccessory, setSelectedAccessory] = React.useState<
    ReturnType<typeof transformAccessories>[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Calculate header left position based on sidebar state
  const getHeaderLeft = () => {
    if (isMobile) return "0";
    // When collapsed in icon mode with floating variant, sidebar is ~4rem (3rem icon + 1rem padding)
    // When expanded, sidebar is 19rem wide (from layout)
    return state === "collapsed" ? "4rem" : "19rem";
  };

  const handleConsultationClick = (
    accessory: ReturnType<typeof transformAccessories>[0]
  ) => {
    setSelectedAccessory(accessory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAccessory(null), 300);
  };

  // Get the original accessory data for description
  const getAccessoryDescription = (accessoryId: string): string => {
    const originalAccessory = accessoryData.accessories_addons.find(
      (acc) =>
        acc["Product ID"] === accessoryId ||
        acc.SKU === accessoryId ||
        acc.name === accessoryId
    );
    return (
      originalAccessory?.["Short Description"] ||
      originalAccessory?.["Description"] ||
      ""
    );
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
              Enhance your robots with premium accessories. Book a consultation
              to learn more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {accessories.map((accessory) => (
              <AccessoryCard
                key={accessory.id}
                accessory={accessory}
                onConsultationClick={handleConsultationClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Addon Consultation Modal */}
      {selectedAccessory && (
        <AddOnConsultationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          addOn={{
            id: selectedAccessory.id,
            name: selectedAccessory.name,
            image: selectedAccessory.image,
            priceStr: selectedAccessory.price,
            description: getAccessoryDescription(selectedAccessory.id),
          }}
        />
      )}
    </>
  );
}
