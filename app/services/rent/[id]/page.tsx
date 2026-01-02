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
import { Heart, Play, ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import rentalData from "@/app/data.json";
import { addOns, getAllFilters } from "../../buy/data/addons";

// Helper function to extract file ID from Google Drive URL
const extractFileId = (url: string): string | null => {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
};

// Helper function to convert Google Drive URL to direct view URL
const convertGoogleDriveUrl = (url: string, isVideo: boolean = false): string => {
  if (!url || typeof url !== "string") return url;
  
  // If it's already a direct URL, return it
  if (url.includes("uc?export=view") || url.includes("uc?export=download") || url.includes("/preview")) {
    return url;
  }
  
  // If it's a Google Drive share link, convert it
  if (url.includes("drive.google.com")) {
    const fileId = extractFileId(url);
    if (fileId) {
      if (isVideo) {
        // For videos, try the preview URL first (works better for embedded playback)
        return `https://drive.google.com/file/d/${fileId}/preview`;
      } else {
        // For images, use the view URL
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
  }
  
  return url;
};

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  if (typeof url !== "string") return false;
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Get rental by ID
const getRentalById = (id: string) => {
  return rentalData.rentals.find((rental) => {
    // Check multiple possible ID fields
    return rental.id === id || 
           rental.SKU === id || 
           rental["Product ID"] === id ||
           rental["SKU"] === id;
  });
};

export default function RentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const rentalId = params.id as string;
  const rental = getRentalById(rentalId);

  // Process images and videos
  const allMedia = React.useMemo(() => {
    if (!rental) return [];
    const media: Array<{ type: "image" | "video"; url: string }> = [];
    
    if (rental.images && Array.isArray(rental.images)) {
      rental.images.forEach((url) => {
        if (typeof url === "string") {
          media.push({ type: "image", url: convertGoogleDriveUrl(url, false) });
        }
      });
    }
    
    if (rental.videos && Array.isArray(rental.videos)) {
      rental.videos.forEach((url) => {
        if (typeof url === "string") {
          media.push({ type: "video", url: convertGoogleDriveUrl(url, true) });
        }
      });
    }
    
    return media;
  }, [rental]);

  const [selectedMediaIndex, setSelectedMediaIndex] = React.useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [mediaLoading, setMediaLoading] = React.useState(true);
  const [showAllAddOns, setShowAllAddOns] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<Set<string>>(
    new Set()
  );

  if (!rental) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Rental not found</h1>
          <Button onClick={() => router.push("/services/rent")}>Back to Rentals</Button>
        </div>
      </div>
    );
  }

  // Get pricing from various possible fields
  const dailyPrice = rental.pricing?.daily_usd || 
                     parseFloat((rental["Rental Price (Daily)"] || "").toString().replace(/[^0-9.]/g, "")) || 
                     null;
  const weeklyPrice = parseFloat((rental["Rental Price (Weekly)"] || "").toString().replace(/[^0-9.]/g, "")) || null;
  const depositAmount = parseFloat((rental["Deposit Required"] || "").toString().replace(/[^0-9.]/g, "")) || null;
  const depositPercent = rental.pricing?.deposit_percent || 
                         (depositAmount && dailyPrice ? Math.round((depositAmount / (dailyPrice * 30)) * 100 * 10) / 10 : 0);
  const monthlyEstimate = dailyPrice ? dailyPrice * 30 : 0;
  
  // Get name from various fields
  const rentalName = rental.name || rental["Model Name"] || rental["Short Description"] || "Rental";
  
  // Get description from various fields
  const rentalDescription = rental.description || rental.Description || rental["Short Description"] || "";
  
  // Get year from various fields
  const rentalYear = rental.year || parseInt(rental["Release Year"] || "0") || null;

  // Get rental ID from various fields for cart/wishlist
  const itemId = rental.id || rental.SKU || rental["Product ID"] || "";

  const handleAddToCart = () => {
    const price = dailyPrice 
      ? `From $${dailyPrice.toLocaleString()}/day`
      : rental.pricing?.model || "Contact for pricing";
    
    // Rent always requires consultation - add to cart and redirect
    addItem({
      id: itemId,
      name: rentalName,
      image: allMedia[0]?.url || "",
      price,
      isRent: true, // Mark as rental item
    });
  };

  const handleToggleWishlist = () => {
    const price = dailyPrice 
      ? `From $${dailyPrice.toLocaleString()}/day`
      : rental.pricing?.model || "Contact for pricing";
    
    if (isInWishlist(itemId)) {
      removeFromWishlist(itemId);
    } else {
      addToWishlist({
        id: itemId,
        name: rentalName,
        image: allMedia[0]?.url || "",
        price,
        monthlyPrice: monthlyEstimate > 0 
          ? `~$${Math.round(monthlyEstimate).toLocaleString()}/mo • ${depositPercent}% deposit`
          : undefined,
      });
    }
  };

  const currentMedia = allMedia[selectedMediaIndex];
  const isCurrentVideo = currentMedia?.type === "video";

  const nextMedia = () => {
    setSelectedMediaIndex((prev) => (prev + 1) % allMedia.length);
    setIsVideoPlaying(false);
    setMediaLoading(true);
  };

  const prevMedia = () => {
    setSelectedMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    setIsVideoPlaying(false);
    setMediaLoading(true);
  };

  // Format specs for display
  const formatSpecs = () => {
    const formatted: Record<string, string> = {};
    
    // If specs is an object, use it directly
    if (rental.specs && typeof rental.specs === "object" && !Array.isArray(rental.specs)) {
      Object.entries(rental.specs).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          formatted[key.replace(/_/g, " ")] = JSON.stringify(value);
        } else {
          formatted[key.replace(/_/g, " ")] = String(value);
        }
      });
    }
    
    // If Specs is a string, parse it
    if (rental.Specs && typeof rental.Specs === "string") {
      const specText = rental.Specs.replace(/<br>/g, " ").replace(/\*\*/g, "");
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
      "Unit Weight", "Shipping Weight", "Dimensions (Standing)", "Dimensions (Packed)",
      "Payload (Typical)", "Payload (Max)", "Max Speed", "Max Climb Angle",
      "Battery Type", "Battery Wh", "Removable Battery", "Runtime",
      "IP Rating", "Certifications", "OS/Firmware", "SDK Available",
      "API Access", "OTA Updates", "HS Code", "Lead Time (Days)"
    ];
    
    specFields.forEach(field => {
      if (rental[field] && rental[field] !== "Unknown" && rental[field] !== "N/A") {
        formatted[field] = String(rental[field]);
      }
    });
    
    return formatted;
  };

  const specs = formatSpecs();
  
  // Parse features if it's a string
  const parseFeatures = () => {
    if (Array.isArray(rental.features)) {
      return rental.features;
    }
    if (rental.Features && typeof rental.Features === "string") {
      // Replace HTML breaks with semicolons, then split on semicolons and bullet points
      const normalized = rental.Features
        .replace(/<br\s*\/?>/gi, ";")
        .split(/(?:;|•)/)
        .map(f => f.trim())
        .filter(f => f && f.length > 0);
      return normalized;
    }
    // Also check lowercase features field as string
    if (rental.features && typeof rental.features === "string") {
      const normalized = rental.features
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
                <BreadcrumbLink href="/services/rent">Rent</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{rentalName}</BreadcrumbPage>
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
            {/* Left Side - Images/Videos */}
            <div className="space-y-4">
              {/* Main Image/Video */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                {mediaLoading && (
                  <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                {isVideoPlaying && isCurrentVideo && currentMedia ? (
                  currentMedia.url.includes("drive.google.com") && currentMedia.url.includes("/preview") ? (
                    <iframe
                      src={currentMedia.url}
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                      onLoad={() => setMediaLoading(false)}
                    />
                  ) : (
                    <video
                      src={currentMedia.url}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onLoadedData={() => setMediaLoading(false)}
                      onError={(e) => {
                        console.error("Video load error:", e);
                        setMediaLoading(false);
                      }}
                      onEnded={() => setIsVideoPlaying(false)}
                      crossOrigin="anonymous"
                    />
                  )
                ) : currentMedia ? (
                  <>
                    {currentMedia.type === "video" ? (
                      <div className="relative w-full h-full">
                        {currentMedia.url.includes("drive.google.com") && currentMedia.url.includes("/preview") ? (
                          <iframe
                            src={currentMedia.url}
                            className="w-full h-full border-0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            onLoad={() => setMediaLoading(false)}
                          />
                        ) : (
                          <>
                            <video
                              src={currentMedia.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              onLoadedData={() => setMediaLoading(false)}
                              onError={(e) => {
                                console.error("Video thumbnail error:", e);
                                setMediaLoading(false);
                              }}
                              crossOrigin="anonymous"
                            />
                            <button
                              onClick={() => setIsVideoPlaying(true)}
                              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                            >
                              <div className="bg-white/90 rounded-full p-4">
                                <Play className="size-12 text-black ml-1" fill="currentColor" />
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <Image
                        src={currentMedia.url}
                        alt={rentalName}
                        fill
                        className={cn(
                          "object-cover transition-opacity duration-300",
                          mediaLoading ? "opacity-0" : "opacity-100"
                        )}
                        onLoad={() => setMediaLoading(false)}
                        onError={() => setMediaLoading(false)}
                      />
                    )}
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
                    <p>No media available</p>
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
                        setIsVideoPlaying(false);
                        setMediaLoading(true);
                      }}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                        selectedMediaIndex === index
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/50"
                      )}
                    >
                      {media.type === "video" ? (
                        <>
                          {media.url.includes("drive.google.com") && media.url.includes("/preview") ? (
                            <iframe
                              src={media.url}
                              className="w-full h-full border-0 pointer-events-none"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                            <Play className="size-6 text-white" fill="currentColor" />
                          </div>
                        </>
                      ) : (
                        <Image
                          src={media.url}
                          alt={`${rentalName} view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Details */}
            <div className="space-y-6">
              {/* Name and Badge */}
              <div>
                {(rentalYear === 2025 || rentalYear === 2024) && (
                  <Badge className="mb-2 bg-blue-600 text-white">NEW</Badge>
                )}
                <h1 className="text-4xl font-bold mb-4">{rentalName}</h1>
                {rentalDescription && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{rentalDescription}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="border-t pt-6">
                {dailyPrice ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold">${dailyPrice.toLocaleString()}</span>
                      <span className="text-lg text-muted-foreground">/day</span>
                    </div>
                    {weeklyPrice && (
                      <p className="text-muted-foreground mb-1">
                        ${weeklyPrice.toLocaleString()}/week
                      </p>
                    )}
                    {monthlyEstimate > 0 && (
                      <p className="text-muted-foreground mb-1">
                        ~${Math.round(monthlyEstimate).toLocaleString()}/mo (30 days)
                      </p>
                    )}
                    {depositAmount && (
                      <p className="text-sm text-muted-foreground mb-1">
                        Deposit: ${depositAmount.toLocaleString()}
                      </p>
                    )}
                    {depositPercent > 0 && !depositAmount && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {depositPercent}% deposit required
                      </p>
                    )}
                    {rental["Minimum Rental Period"] && (
                      <p className="text-sm text-muted-foreground">
                        Minimum rental: {rental["Minimum Rental Period"]}
                      </p>
                    )}
                  </>
                ) : rental.pricing?.model ? (
                  <p className="text-2xl font-semibold">{rental.pricing.model}</p>
                ) : (
                  <p className="text-2xl font-semibold">Contact for pricing</p>
                )}
                {(rental.availability || rental["Stock Status"]) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Availability: {rental.availability || rental["Stock Status"]}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 space-y-3">
                <Button
                  onClick={() => {
                    handleAddToCart();
                    router.push("/checkout/consultation");
                  }}
                  size="lg"
                  className="w-full"
                >
                  Schedule Consultation & Add to Cart
                </Button>
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

            {/* Environment */}
            {rental.environment && rental.environment.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Operating Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {rental.environment.map((env, index) => (
                      <Badge key={index} variant="secondary">
                        {env}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Software */}
            {rental.software && rental.software.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Software Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {rental.software.map((sw, index) => (
                      <Badge key={index} variant="outline">
                        {sw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {rental.category && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Category</dt>
                      <dd className="text-muted-foreground">{rental.category}</dd>
                    </div>
                  )}
                  {(rental.manufacturer || rental.Manufacturer) && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Manufacturer</dt>
                      <dd className="text-muted-foreground">{rental.manufacturer || rental.Manufacturer}</dd>
                    </div>
                  )}
                  {(rentalYear || rental["Release Year"]) && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Year</dt>
                      <dd className="text-muted-foreground">{rentalYear || rental["Release Year"]}</dd>
                    </div>
                  )}
                  {(rental.origin || rental["Country of Origin"]) && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Origin</dt>
                      <dd className="text-muted-foreground">{rental.origin || rental["Country of Origin"]}</dd>
                    </div>
                  )}
                  {(rental.model || rental["Version/Revision"]) && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Model/Version</dt>
                      <dd className="text-muted-foreground">{rental.model || rental["Version/Revision"]}</dd>
                    </div>
                  )}
                  {(rental.SKU || rental["Product ID"]) && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">SKU/Product ID</dt>
                      <dd className="text-muted-foreground">{rental.SKU || rental["Product ID"]}</dd>
                    </div>
                  )}
                  {rental["Vendor ID"] && (
                    <div className="flex justify-between border-b pb-2">
                      <dt className="font-medium">Vendor ID</dt>
                      <dd className="text-muted-foreground">{rental["Vendor ID"]}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
            
            {/* Pricing & Terms */}
            {(rental.Shipping || rental.Tax || rental.Warranty || rental["Insurance Required"]) && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    {rental.Shipping && rental.Shipping !== "N/A" && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Shipping</dt>
                        <dd className="text-muted-foreground">{rental.Shipping}</dd>
                      </div>
                    )}
                    {rental.Tax && rental.Tax !== "N/A" && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Tax</dt>
                        <dd className="text-muted-foreground">{rental.Tax}</dd>
                      </div>
                    )}
                    {rental.Warranty && rental.Warranty !== "N/A" && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Warranty</dt>
                        <dd className="text-muted-foreground">{rental.Warranty}</dd>
                      </div>
                    )}
                    {rental["Insurance Required"] && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Insurance</dt>
                        <dd className="text-muted-foreground">{rental["Insurance Required"]}</dd>
                      </div>
                    )}
                    {rental["Commission %"] && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="font-medium">Commission</dt>
                        <dd className="text-muted-foreground">{rental["Commission %"]}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}
            
            {/* Disclaimers */}
            {(rental["Intended Use Disclaimer"] || rental["Liability Disclaimer"]) && (
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rental["Intended Use Disclaimer"] && (
                      <div>
                        <h4 className="font-semibold mb-2">Intended Use</h4>
                        <p className="text-sm text-muted-foreground">{rental["Intended Use Disclaimer"]}</p>
                      </div>
                    )}
                    {rental["Liability Disclaimer"] && (
                      <div>
                        <h4 className="font-semibold mb-2">Liability</h4>
                        <p className="text-sm text-muted-foreground">{rental["Liability Disclaimer"]}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Comprehensive Add-ons Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-semibold mb-2 text-black dark:text-white">
                Robot Add-ons & Features
              </h2>
              <p className="text-base text-black/70 dark:text-white/70">
                Enhance your robot with powerful add-ons and features tailored
                to your industry needs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-background border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
                    Filter by Feature
                  </h3>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {getAllFilters().map((filter) => (
                      <div
                        key={filter}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={filter}
                          checked={selectedFilters.has(filter)}
                          onCheckedChange={() => {
                            setSelectedFilters((prev) => {
                              const newSet = new Set(prev);
                              if (newSet.has(filter)) {
                                newSet.delete(filter);
                              } else {
                                newSet.add(filter);
                              }
                              return newSet;
                            });
                          }}
                        />
                        <label
                          htmlFor={filter}
                          className="text-sm cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          {filter}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedFilters.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => setSelectedFilters(new Set())}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Add-ons List */}
              <div className="lg:col-span-3">
                {(() => {
                  let filtered = addOns;
                  if (selectedFilters.size > 0) {
                    filtered = addOns.filter((addOn) =>
                      addOn.filters.some((filter) => selectedFilters.has(filter))
                    );
                  }
                  const displayed = showAllAddOns
                    ? filtered
                    : filtered.slice(0, 6);
                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayed.map((addOn) => (
                          <motion.div
                            key={addOn.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-background"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{addOn.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-semibold text-sm text-black dark:text-white">
                                    {addOn.name}
                                  </h4>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {addOn.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {addOn.industries.slice(0, 3).map((industry) => (
                                    <Badge
                                      key={industry}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {industry}
                                    </Badge>
                                  ))}
                                  {addOn.industries.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{addOn.industries.length - 3}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {addOn.filters.slice(0, 2).map((filter) => (
                                    <Badge
                                      key={filter}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {filter}
                                    </Badge>
                                  ))}
                                  {addOn.filters.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{addOn.filters.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {filtered.length > 6 && (
                        <div className="mt-6 text-center">
                          <Button
                            variant="outline"
                            onClick={() => setShowAllAddOns(!showAllAddOns)}
                            className="w-full sm:w-auto"
                          >
                            {showAllAddOns ? (
                              <>
                                Show Less
                                <ChevronUp className="ml-2 h-4 w-4" />
                              </>
                            ) : (
                              <>
                                View All {filtered.length} Add-ons
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

