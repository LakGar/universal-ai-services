"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Wishlist1Props {
  className?: string;
}

const Wishlist1 = ({ className }: Wishlist1Props) => {
  const { items: wishlistItems, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
    });
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
      });
    });
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">My Wishlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAllToCart}
            className="w-full sm:w-auto"
          >
            <ShoppingCart className="mr-2 size-4" />
            Add All to Cart
          </Button>
        )}
      </div>

      {/* Grid */}
      {wishlistItems.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
          {wishlistItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden p-0" // Remove Card padding, edge-to-edge image on top
            >
              <div className="relative">
                <AspectRatio ratio={1} className="bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </AspectRatio>
                {/* Remove Button */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <CardContent className="px-3 pb-4 space-y-2">
                <h3 className="font-medium leading-tight text-sm line-clamp-2">
                  {item.name}
                </h3>
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold">{item.price}</span>
                  {item.monthlyPrice && (
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {item.monthlyPrice}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="w-full text-xs h-8"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="mr-1.5 size-3.5" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Heart className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Save items you love by clicking the heart icon on any product
          </p>
          <Button>Continue Shopping</Button>
        </div>
      )}
    </div>
  );
};

export { Wishlist1 };
