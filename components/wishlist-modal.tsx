"use client";

import * as React from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function WishlistModal() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">My Wishlist</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {items.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <Card key={item.id} className="group overflow-hidden">
                <div className="relative">
                  <AspectRatio ratio={1} className="bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>

                  {/* Remove Button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-medium leading-tight text-sm mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-semibold">{item.price}</span>
                    {item.monthlyPrice && (
                      <span className="text-xs text-muted-foreground">
                        {item.monthlyPrice}
                      </span>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="mr-2 size-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Heart className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Save items you love by clicking the heart icon on any product
          </p>
        </div>
      )}
    </div>
  );
}

