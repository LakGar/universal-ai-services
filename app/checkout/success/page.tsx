"use client";

import * as React from "react";
import { useCart } from "@/contexts/cart-context";
import { OrderSummary1 } from "@/components/order-summary1";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [orderData, setOrderData] = React.useState<any>(null);
  const [hasCleared, setHasCleared] = React.useState(false);

  React.useEffect(() => {
    if (items.length === 0 && !orderData) {
      router.push("/services/buy");
      return;
    }

    // Convert cart items to order summary format before clearing
    if (items.length > 0 && !orderData) {
      const subtotal = items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
        return sum + price * item.quantity;
      }, 0);

      const tax = subtotal * 0.08; // 8% tax
      const shipping = 0; // Free shipping
      const total = subtotal + tax + shipping;

      setOrderData({
        orderNumber: `ORD-${Date.now()}`,
        orderDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: "confirmed" as const,
        email: "customer@example.com",
        items: items.map((item) => ({
          id: item.id.toString(),
          name: item.name,
          image: item.image,
          price: parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0,
          quantity: item.quantity,
          details: [],
        })),
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: {
          name: "Customer Name",
          street: "123 Main Street",
          city: "San Francisco",
          state: "CA",
          zipCode: "94102",
          country: "United States",
        },
        shippingMethod: "Standard Shipping",
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
        paymentMethod: {
          type: "card" as const,
          lastFour: "4242",
          cardBrand: "Visa",
        },
      });

      // Clear cart after storing order data
      if (!hasCleared) {
        clearCart();
        setHasCleared(true);
      }
    }
  }, [items, orderData, router, clearCart, hasCleared]);

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading order summary...</p>
      </div>
    );
  }

  return <OrderSummary1 order={orderData} />;
}

