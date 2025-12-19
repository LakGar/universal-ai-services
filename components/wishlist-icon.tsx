"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Wishlist1 } from "@/components/wishlist1";

export function WishlistIcon() {
  const { itemCount } = useWishlist();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Wishlist"
        >
          <Heart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto p-6 pt-10">
        <SheetTitle className="sr-only">Wishlist</SheetTitle>
        <Wishlist1 />
      </SheetContent>
    </Sheet>
  );
}
