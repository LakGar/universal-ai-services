"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  alt: string;
  price: string;
  monthlyPrice?: string;
  colors?: string[];
  isNew?: boolean;
  className?: string;
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
}: ProductCardProps) {
  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const inWishlist = isInWishlist(id);

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
        "w-full flex flex-col gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors relative group",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {isNew && (
        <div className="absolute top-2 right-2 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded w-fit z-10">
          NEW
        </div>
      )}
      <Link href={`/services/buy/${id}`} className="block">
        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="relative aspect-3/4 w-full rounded-lg overflow-hidden bg-muted cursor-pointer">
          <Image src={image} alt={alt} fill className="object-cover" />
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
      <div className="flex flex-col gap-1">
        <p className="text-sm text-foreground font-medium">{price}</p>
        {monthlyPrice && (
          <p className="text-xs text-muted-foreground">{monthlyPrice}</p>
        )}
      </div>
      <div className="flex gap-2">
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
          <Link href={`/services/buy/${id}`}>View Details</Link>
        </Button>
      </div>
    </motion.div>
  );
}
