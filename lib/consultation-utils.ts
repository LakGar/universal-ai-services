import type { CartItem } from "@/contexts/cart-context";

/**
 * Determines if a price indicates "price on demand" or no price
 */
export function isPriceOnDemand(price: string | number | undefined | null): boolean {
  if (!price) return true;
  
  const priceStr = typeof price === "number" ? price.toString() : String(price);
  const normalizedPrice = priceStr.toLowerCase().trim();
  
  // Check for common "no price" indicators
  if (
    normalizedPrice === "n/a" ||
    normalizedPrice === "na" ||
    normalizedPrice === "contact for pricing" ||
    normalizedPrice === "contact micro-ip" ||
    normalizedPrice === "price on request" ||
    normalizedPrice === "on demand" ||
    normalizedPrice === "—" ||
    normalizedPrice === "-" ||
    normalizedPrice === ""
  ) {
    return true;
  }
  
  // Check if it's a valid number
  const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  if (isNaN(numericPrice) || numericPrice === 0) {
    return true;
  }
  
  return false;
}

/**
 * Determines if a cart item requires consultation
 */
export function requiresConsultation(item: CartItem): boolean {
  // Rent items always require consultation
  if (item.isRent) return true;
  
  // Check if price is on demand
  const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ""));
  if (isPriceOnDemand(item.price) || priceValue === 0) {
    return true;
  }
  
  // Check if item has add-ons or accessories
  if (item.addOns && item.addOns.length > 0) {
    return true;
  }
  
  return false;
}

/**
 * Separates cart items into those that require consultation and those that don't
 */
export function separateItemsByConsultationRequirement(
  items: CartItem[]
): {
  requiresConsultation: CartItem[];
  directCheckout: CartItem[];
} {
  const itemsNeedingConsultation: CartItem[] = [];
  const directCheckout: CartItem[] = [];
  
  // Store reference to function to avoid any potential shadowing issues
  const checkRequiresConsultation = requiresConsultation;
  
  items.forEach((item) => {
    if (checkRequiresConsultation(item)) {
      itemsNeedingConsultation.push(item);
    } else {
      directCheckout.push(item);
    }
  });
  
  return { requiresConsultation: itemsNeedingConsultation, directCheckout };
}

