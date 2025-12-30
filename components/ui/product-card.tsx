"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";

interface ProductCardProps {
  id: number | string;
  name: string;
  image: string;
  alt: string;
  price: string;
  monthlyPrice?: string;
  colors?: string[];
  isNew?: boolean;
  className?: string;
  isVideo?: boolean;
  linkPath?: string;
}

export function ProductCard({
  id,
  name,
  image,
  alt,
  price,
  monthlyPrice,
  isNew = false,
  className,
  isVideo: isVideoProp,
  linkPath,
}: ProductCardProps) {
  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const inWishlist = isInWishlist(id);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);
  const isVideo = React.useMemo(() => {
    if (isVideoProp !== undefined) return isVideoProp;
    if (!image) return false;
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
    return videoExtensions.some((ext) => image.toLowerCase().includes(ext));
  }, [image, isVideoProp]);

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      image,
      price,
    });
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        image,
        price,
        monthlyPrice,
      });
    }
  };

  return (
    <motion.div
      className={cn(
        "w-full flex flex-col gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors relative group h-full",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={linkPath || `/services/buy/${id}`} className="block flex-shrink-0">
        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors h-[3.5rem] line-clamp-2 flex items-start">
          {name}
        </h3>
        <div className="relative aspect-3/4 w-full rounded-lg overflow-hidden bg-muted cursor-pointer">
          {imageLoading && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          {isVideo ? (
            <div className="relative w-full h-full flex items-center justify-center bg-muted">
              {image.includes("drive.google.com") && image.includes("/preview") ? (
                <iframe
                  src={image}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              ) : (
                <video
                  src={image}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onLoadedData={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  crossOrigin="anonymous"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <div className="bg-white/90 rounded-full p-3">
                  <Play
                    className="size-8 text-black ml-1"
                    fill="currentColor"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {!imageError && (
                <Image
                  src={image}
                  alt={alt}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-300",
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
            </>
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
        onClick={(e) => {
          e.preventDefault();
          handleWishlistToggle();
        }}
      >
        <Heart
          className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")}
        />
      </Button>
      <div className="flex flex-col gap-1 h-[3.5rem] flex-shrink-0">
        <p className="text-sm text-foreground font-medium line-clamp-1 h-5">{price}</p>
        {monthlyPrice ? (
          <p className="text-xs text-muted-foreground line-clamp-2 h-8">{monthlyPrice}</p>
        ) : (
          <div className="h-8" />
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0 mt-auto">
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          className="flex-1 text-white hover:bg-secondary hover:text-primary"
        >
          Buy
        </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={linkPath || `/services/buy/${id}`}>View Details</Link>
            </Button>
      </div>
    </motion.div>
  );
}
