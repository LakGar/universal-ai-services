"use client";

import * as React from "react";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CartModal() {
  const { items: cartItems, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const handleQuantityChange = (cartItemId: string, change: number) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (item) {
      updateQuantity(cartItemId, item.quantity + change);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
    return sum + price * item.quantity;
  }, 0);

  // Check if any items require consultation (for now, we'll check by ID or add a flag)
  const requiresConsultation = cartItems.some((item) => item.id <= 3); // Example: first 3 items require consultation

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>
        {cartItems.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">${total.toFixed(2)}</p>
          </div>
        )}
      </div>

      {/* Grid */}
      {cartItems.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 mb-20">
          {cartItems.map((item) => (
            <Card key={item.cartItemId} className="group overflow-hidden p-0">
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
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeItem(item.cartItemId)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <CardContent className="px-3 pb-4 space-y-2">
                <h3 className="font-medium leading-tight text-sm line-clamp-2">
                  {item.name}
                </h3>
                {item.addOns && item.addOns.length > 0 && (
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p className="font-medium">Includes:</p>
                    {item.addOns.map((addOn) => (
                      <p key={addOn.id} className="line-clamp-1">
                        • {addOn.name}
                        {addOn.price > 0 && ` (+$${addOn.price.toLocaleString()})`}
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold">{item.price}</span>
                </div>
                {/* Quantity Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleQuantityChange(item.cartItemId, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleQuantityChange(item.cartItemId, 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Add items to your cart to see them here
          </p>
          <Button>Continue Shopping</Button>
        </div>
      )}

      {/* Checkout Button - Sticky at bottom right */}
      {cartItems.length > 0 && (
        <div className="sticky bottom-6 flex justify-end mt-6">
          <Button onClick={handleCheckout} size="lg" className="shadow-lg">
            Proceed to Checkout
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
