"use client";

import * as React from "react";
import { useCart } from "@/contexts/cart-context";
import { Checkout1 } from "@/components/checkout1";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

  // Convert cart items to checkout format
  const cartItems = React.useMemo(() => {
    return items.map((item, index) => ({
      product_id: `product-${item.id}`,
      link: "#",
      name: item.name,
      image: item.image,
      price: {
        regular: parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0,
        currency: "USD",
      },
      quantity: item.quantity,
      details: [],
    }));
  }, [items]);

  // Check if any items require consultation
  const requiresConsultation = items.some((item) => item.id <= 3);

  React.useEffect(() => {
    if (items.length === 0) {
      router.push("/services/buy");
      return;
    }

    // If consultation is required, redirect to consultation page
    if (requiresConsultation) {
      router.push("/checkout/consultation");
    }
  }, [items.length, requiresConsultation, router]);

  if (items.length === 0) {
    return null;
  }

  // If consultation is required, show loading or redirect
  if (requiresConsultation) {
    return null;
  }

  const handleCheckoutSuccess = () => {
    router.push("/checkout/success");
  };

  return <Checkout1 cartItems={cartItems} onSuccess={handleCheckoutSuccess} />;
}

