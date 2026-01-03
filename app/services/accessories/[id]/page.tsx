"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CartIcon } from "@/components/cart-icon";
import { WishlistIcon } from "@/components/wishlist-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import accessoryData from "@/app/data.json";
import { isPriceOnDemand } from "@/lib/consultation-utils";

// Helper function to extract file ID from Google Drive URL
const extractFileId = (url: string): string | null => {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
};

// Helper function to convert Google Drive URL to direct view URL
const convertGoogleDriveUrl = (url: string): string => {
  if (!url || typeof url !== "string") {
    return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
  }
  
  // If it's already a direct URL, return it
  if (url.includes("uc?export=view") || url.includes("uc?export=download") || url.includes("/preview")) {
    return url;
  }
  
  // If it's a Google Drive share link, convert it
  if (url.includes("drive.google.com")) {
    const fileId = extractFileId(url);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  
  // If it's already a direct URL, return it
  if (url.startsWith("http")) {
    return url;
  }
  
  // Fallback
  return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
};

// Get accessory by ID
const getAccessoryById = (id: string) => {
  return accessoryData.accessories_addons.find((accessory) => {
    return accessory["Product ID"] === id || 
           accessory.SKU === id ||
           accessory.name === id;
  });
};

export default function AccessoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const accessoryId = params.id as string;
  const accessory = getAccessoryById(accessoryId);

  // Process images
  const allMedia = React.useMemo(() => {
    if (!accessory) return [];
    const media: Array<{ type: "image"; url: string }> = [];
    
    if (accessory.images && Array.isArray(accessory.images)) {
      accessory.images.forEach((url) => {
        if (typeof url === "string") {
          media.push({ type: "image", url: convertGoogleDriveUrl(url) });
        }
      });
    }
    
    // Fallback to placeholder if no images
    if (media.length === 0) {
      media.push({ 
        type: "image", 
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80" 
      });
    }
    
    return media;
  }, [accessory]);

  const [selectedMediaIndex, setSelectedMediaIndex] = React.useState(0);
  const [mediaLoading, setMediaLoading] = React.useState(true);
  const [thumbnailLoading, setThumbnailLoading] = React.useState<Set<number>>(new Set());

  // Initialize thumbnail loading state when allMedia changes
  React.useEffect(() => {
    const loadingSet = new Set<number>();
    allMedia.forEach((_, index) => loadingSet.add(index));
    setThumbnailLoading(loadingSet);
  }, [allMedia]);

  if (!accessory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accessory not found</h1>
          <Button onClick={() => router.push("/services/accessories")}>Back to Accessories</Button>
        </div>
      </div>
    );
  }

  // Get pricing information
  let price = "Contact for pricing";
  let priceValue = 0;
  
  if (accessory.MSRP && 
      accessory.MSRP !== "Contact Micro-IP" && 
      accessory.MSRP !== "N/A" &&
      typeof accessory.MSRP === "string") {
    const msrpValue = parseFloat(accessory.MSRP.replace(/[^0-9.]/g, ""));
    if (msrpValue > 0 && !isNaN(msrpValue)) {
      price = `$${msrpValue.toLocaleString()}`;
      priceValue = msrpValue;
    }
  }
  
  if (accessory["UAIS Price"] && 
      accessory["UAIS Price"] !== "N/A" && 
      price === "Contact for pricing") {
    const uaisPrice = accessory["UAIS Price"].toString();
    if (uaisPrice.includes("$")) {
      price = uaisPrice;
      const extracted = parseFloat(uaisPrice.replace(/[^0-9.]/g, ""));
      if (!isNaN(extracted)) priceValue = extracted;
    } else {
      const uaisValue = parseFloat(uaisPrice.replace(/[^0-9.]/g, ""));
      if (uaisValue > 0 && !isNaN(uaisValue)) {
        price = `$${uaisValue.toLocaleString()}`;
        priceValue = uaisValue;
      }
    }
  }
  
  if (accessory.MSRP === "Contact Micro-IP") {
    price = "Contact for pricing";
  }

  // Get name and description
  const accessoryName = accessory.name || "Accessory";
  const accessoryDescription = accessory.Description || accessory["Short Description"] || "";
  
  // Get year from various fields
  const releaseYear = parseInt(accessory["Release Year"] || "0") || null;
  const isNew = releaseYear !== null && releaseYear >= 2024;

  // Get item ID for cart/wishlist
  const itemId = accessory["Product ID"] || accessory.SKU || accessory.name || "";

  // Check if consultation is required (accessories need consultation if price is on demand)
  const needsConsultation = React.useMemo(() => {
    return isPriceOnDemand(price) || priceValue === 0;
  }, [price, priceValue]);

  const handleAddToCart = () => {
    addItem({
      id: itemId,
      name: accessoryName,
      image: allMedia[0]?.url || "",
      price,
    });
    
    // If consultation is needed, redirect to consultation page
    if (needsConsultation) {
      router.push("/checkout/consultation");
    }
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(itemId)) {
      removeFromWishlist(itemId);
    } else {
      addToWishlist({
        id: itemId,
        name: accessoryName,
        image: allMedia[0]?.url || "",
        price,
        monthlyPrice: accessory.Manufacturer || accessory["Short Description"] || "",
      });
    }
  };

  const currentMedia = allMedia[selectedMediaIndex];

  const nextMedia = () => {
    setSelectedMediaIndex((prev) => (prev + 1) % allMedia.length);
    setMediaLoading(true);
  };

  const prevMedia = () => {
    setSelectedMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    setMediaLoading(true);
  };

  // Format specs for display
  const formatSpecs = () => {
    const formatted: Record<string, string> = {};
    
    // If Specs is a string, parse it
    if (accessory.Specs && typeof accessory.Specs === "string") {
      const specText = accessory.Specs.replace(/<br>/g, " ").replace(/\*\*/g, "");
      const lines = specText.split(/[•\n;]/).filter(l => l.trim());
      lines.forEach(line => {
        const match = line.match(/([^:]+):\s*(.+)/);
        if (match) {
          const key = match[1].trim();
          formatted[key] = match[2].trim();
        }
      });
    }
    
    // Add individual spec fields if they exist
    const specFields = [
      "Operating Environment", "IP Rating", "Certifications", "OS/Firmware",
      "SDK Available", "Supported Languages", "API Access", "OTA Updates",
      "Battery Type", "Battery Wh", "Removable Battery", "Runtime",
      "Unit Weight", "Shipping Weight", "Dimensions (Standing)", "Dimensions (Packed)",
      "Payload (Typical)", "Payload (Max)", "Max Speed", "Max Climb Angle",
      "HS Code", "Lead Time (Days)", "Availability", "Stock Status"
    ];
    
    specFields.forEach(field => {
      const value = (accessory as Record<string, unknown>)[field];
      if (value && value !== "Unknown" && value !== "N/A") {
        formatted[field] = String(value);
      }
    });
    
    return formatted;
  };

  const specs = formatSpecs();
  
  // Parse features if it's a string
  const parseFeatures = () => {
    if (accessory.Features && typeof accessory.Features === "string") {
      const normalized = accessory.Features
        .replace(/<br\s*\/?>/gi, ";")
        .split(/(?:;|•)/)
        .map(f => f.trim())
        .filter(f => f && f.length > 0);
      return normalized;
    }
    return [];
  };
  
  const features = parseFeatures();

  return (
    <>
      <header className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b w-[calc(100%-var(--sidebar-width))] md:w-[calc(100%-var(--sidebar-width)-1rem)]">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/services">Services</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/services/accessories">Accessories</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{accessoryName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <WishlistIcon />
          <CartIcon />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-20 min-w-0">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Side - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                {mediaLoading && (
                  <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                {currentMedia ? (
                  <>
                    <Image
                      src={currentMedia.url}
                      alt={accessoryName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        mediaLoading ? "opacity-0" : "opacity-100"
                      )}
                      onLoad={() => setMediaLoading(false)}
                      onError={() => setMediaLoading(false)}
                      loading={selectedMediaIndex === 0 ? "eager" : "lazy"}
                      priority={selectedMediaIndex === 0}
                    />
                    {allMedia.length > 1 && (
                      <>
                        <button
                          onClick={prevMedia}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                        >
                          <ChevronLeft className="size-6" />
                        </button>
                        <button
                          onClick={nextMedia}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                        >
                          <ChevronRight className="size-6" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                    <p>No image available</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allMedia.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMediaIndex(index);
                        setMediaLoading(true);
                      }}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                        selectedMediaIndex === index
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/50"
                      )}
                    >
                      {thumbnailLoading.has(index) && (
                        <Skeleton className="absolute inset-0 w-full h-full" />
                      )}
                      <Image
                        src={media.url}
                        alt={`${accessoryName} view ${index + 1}`}
                        fill
                        className={cn(
                          "object-cover transition-opacity duration-300",
                          thumbnailLoading.has(index) ? "opacity-0" : "opacity-100"
                        )}
                        onLoad={() => {
                          setThumbnailLoading((prev) => {
                            const next = new Set(prev);
                            next.delete(index);
                            return next;
                          });
                        }}
                        onError={() => {
                          setThumbnailLoading((prev) => {
                            const next = new Set(prev);
                            next.delete(index);
                            return next;
                          });
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Details */}
            <div className="space-y-6">
              {/* Name and Badge */}
              <div>
                {isNew && (
                  <Badge className="mb-2 bg-blue-600 text-white">NEW</Badge>
                )}
                <h1 className="text-4xl font-bold mb-4">{accessoryName}</h1>
                {accessoryDescription && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{accessoryDescription}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="border-t pt-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">{price}</span>
                </div>
                {accessory.Manufacturer && (
                  <p className="text-muted-foreground">
                    Manufacturer: {accessory.Manufacturer}
                  </p>
                )}
                {(accessory.Availability || accessory["Stock Status"]) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Availability: {accessory.Availability || accessory["Stock Status"]}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 space-y-3">
                {needsConsultation ? (
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full"
                  >
                    Schedule Consultation & Add to Cart
                  </Button>
                ) : (
                  <Button onClick={handleAddToCart} size="lg" className="w-full">
                    Add to Cart
                  </Button>
                )}
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Heart
                    className={cn(
                      "mr-2 size-5",
                      isInWishlist(itemId) && "fill-red-500 text-red-500"
                    )}
                  />
                  {isInWishlist(itemId) ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Specs, Features, and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-2">
                        <dt className="font-medium capitalize">{key}</dt>
                        <dd className="text-muted-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {accessory.Category && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Category</dt>
                      <dd className="text-muted-foreground">{accessory.Category}</dd>
                    </div>
                  )}
                  {accessory.Manufacturer && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Manufacturer</dt>
                      <dd className="text-muted-foreground">{accessory.Manufacturer}</dd>
                    </div>
                  )}
                  {releaseYear && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Release Year</dt>
                      <dd className="text-muted-foreground">{releaseYear}</dd>
                    </div>
                  )}
                  {accessory["Version/Revision"] && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Version</dt>
                      <dd className="text-muted-foreground">{accessory["Version/Revision"]}</dd>
                    </div>
                  )}
                  {(accessory.SKU || accessory["Product ID"]) && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">SKU/Product ID</dt>
                      <dd className="text-muted-foreground">{accessory.SKU || accessory["Product ID"]}</dd>
                    </div>
                  )}
                  {accessory["Vendor ID"] && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Vendor ID</dt>
                      <dd className="text-muted-foreground">{accessory["Vendor ID"]}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
            
            {/* Pricing & Terms */}
            {(accessory.Shipping || accessory.Tax || accessory.Warranty || accessory["Insurance Required"] || accessory["Deposit Required"]) && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    {accessory.Shipping && accessory.Shipping !== "N/A" && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Shipping</dt>
                        <dd className="text-muted-foreground">{accessory.Shipping}</dd>
                      </div>
                    )}
                    {accessory.Tax && accessory.Tax !== "N/A" && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Tax</dt>
                        <dd className="text-muted-foreground">{accessory.Tax}</dd>
                      </div>
                    )}
                    {accessory.Warranty && accessory.Warranty !== "N/A" && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Warranty</dt>
                        <dd className="text-muted-foreground">{accessory.Warranty}</dd>
                      </div>
                    )}
                    {accessory["Deposit Required"] && accessory["Deposit Required"] !== "N/A" && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Deposit</dt>
                        <dd className="text-muted-foreground">{accessory["Deposit Required"]}</dd>
                      </div>
                    )}
                    {accessory["Insurance Required"] && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Insurance</dt>
                        <dd className="text-muted-foreground">{accessory["Insurance Required"]}</dd>
                      </div>
                    )}
                    {accessory["Commission %"] && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Commission</dt>
                        <dd className="text-muted-foreground">{accessory["Commission %"]}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}
            
            {/* Disclaimers */}
            {(accessory["Intended Use Disclaimer"] || accessory["Liability Disclaimer"]) && (
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accessory["Intended Use Disclaimer"] && (
                      <div>
                        <h4 className="font-semibold mb-2">Intended Use</h4>
                        <p className="text-sm text-muted-foreground">{accessory["Intended Use Disclaimer"]}</p>
                      </div>
                    )}
                    {accessory["Liability Disclaimer"] && (
                      <div>
                        <h4 className="font-semibold mb-2">Liability</h4>
                        <p className="text-sm text-muted-foreground">{accessory["Liability Disclaimer"]}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Source URL */}
            {accessory["Source URL"] && accessory["Source URL"].startsWith("http") && (
              <Card>
                <CardHeader>
                  <CardTitle>More Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={accessory["Source URL"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Product Page →
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

