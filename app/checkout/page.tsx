"use client";

import * as React from "react";
import { useCart } from "@/contexts/cart-context";
import { Checkout1 } from "@/components/checkout1";
import { useRouter } from "next/navigation";
import {
  separateItemsByConsultationRequirement,
  requiresConsultation,
} from "@/lib/consultation-utils";

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

  // Separate items by consultation requirement
  const { requiresConsultation: itemsNeedingConsultation, directCheckout } =
    React.useMemo(() => separateItemsByConsultationRequirement(items), [items]);

  const hasItemsNeedingConsultation = itemsNeedingConsultation.length > 0;
  const [consultationScheduled, setConsultationScheduled] =
    React.useState(false);

  // Convert cart items to checkout format
  // If consultation is scheduled, include all items; otherwise only direct checkout items
  const cartItems = React.useMemo(() => {
    // Check sessionStorage directly to ensure we have the latest value
    const isScheduled =
      typeof window !== "undefined"
        ? sessionStorage.getItem("consultationScheduled") === "true"
        : consultationScheduled;

    const itemsToCheckout = isScheduled
      ? [...directCheckout, ...itemsNeedingConsultation]
      : directCheckout;

    return itemsToCheckout.map((item, index) => {
      // Check if this is a consultation-required item
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      const isConsultationRequired =
        priceValue === 0 ||
        item.price.toLowerCase().includes("consultation") ||
        item.price.toLowerCase().includes("request");

      return {
        product_id: `product-${item.id}`,
        link: "#",
        name: item.name,
        image: item.image,
        price: {
          regular: priceValue,
          currency: "USD",
          consultationRequired: isConsultationRequired, // Flag to indicate price will be decided
        },
        quantity: item.quantity,
        details: [],
      };
    });
  }, [directCheckout, itemsNeedingConsultation, consultationScheduled]);

  React.useEffect(() => {
    // Check if consultation has been scheduled
    const scheduled =
      sessionStorage.getItem("consultationScheduled") === "true";
    setConsultationScheduled(scheduled);
  }, []);

  React.useEffect(() => {
    if (items.length === 0) {
      router.push("/services/buy");
      return;
    }

    // Always check sessionStorage directly (not just state) to avoid race conditions
    const scheduled =
      sessionStorage.getItem("consultationScheduled") === "true";

    // Update state if scheduled
    if (scheduled && !consultationScheduled) {
      setConsultationScheduled(true);
    }

    // If any items require consultation and consultation hasn't been scheduled, redirect to consultation page
    if (hasItemsNeedingConsultation && !scheduled) {
      router.push("/checkout/consultation");
    }
  }, [
    items.length,
    hasItemsNeedingConsultation,
    consultationScheduled,
    router,
  ]);

  if (items.length === 0) {
    return null;
  }

  // If consultation is required and not scheduled, show loading or redirect
  // Check sessionStorage directly to avoid race conditions
  const isConsultationScheduled =
    sessionStorage.getItem("consultationScheduled") === "true";
  if (hasItemsNeedingConsultation && !isConsultationScheduled) {
    return null;
  }

  const handleCheckoutSuccess = () => {
    router.push("/checkout/success");
  };

  return <Checkout1 cartItems={cartItems} onSuccess={handleCheckoutSuccess} />;
}
