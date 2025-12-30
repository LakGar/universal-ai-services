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
import {
  Heart,
  Play,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import buyData from "../data/buy_data.json";
import { addOns, getAllFilters, type AddOn } from "../data/addons";
import accessoryData from "@/app/data.json";

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  if (typeof url !== "string") return false;
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Helper function to extract file ID from Google Drive URL
const extractGoogleDriveFileId = (url: string): string | null => {
  // Match: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return fileMatch[1];
  }
  // Match: https://drive.google.com/drive/folders/FOLDER_ID
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    return folderMatch[1];
  }
  return null;
};

// Helper function to convert Google Drive link to direct URL
const convertGoogleDriveUrl = (
  link: string,
  isVideo: boolean = false
): string => {
  if (link.startsWith("http") && !link.includes("drive.google.com")) {
    return link; // Already a direct URL
  }

  const fileId = extractGoogleDriveFileId(link);
  if (!fileId) return link;

  if (isVideo) {
    // For videos, try multiple formats
    // First try the view URL (works if file is publicly shared)
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
    // Alternative: `https://drive.google.com/file/d/${fileId}/preview` (for preview)
    // Or: `https://drive.google.com/uc?export=download&id=${fileId}` (for download)
  } else {
    // For images, use the view URL
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
};

// Helper function to get media items (images and videos) from Google Drive
const getProductMedia = (item: any): { images: string[]; videos: string[] } => {
  const images: string[] = [];
  const videos: string[] = [];

  // If Images field exists and is an array, use it
  if (item.Images && Array.isArray(item.Images) && item.Images.length > 0) {
    item.Images.forEach((url: string) => {
      if (isVideoUrl(url)) {
        videos.push(url);
      } else {
        images.push(url);
      }
    });
    if (images.length > 0 || videos.length > 0) {
      return { images, videos };
    }
  }

  // Check if Location ID is an array of Google Drive links
  const locationId = item["Location ID"];
  if (Array.isArray(locationId) && locationId.length > 0) {
    locationId.forEach((link: any) => {
      if (typeof link === "string") {
        const isVideo = isVideoUrl(link);
        const convertedUrl = convertGoogleDriveUrl(link, isVideo);

        if (isVideo) {
          videos.push(convertedUrl);
        } else if (
          link.includes("drive.google.com") ||
          link.startsWith("http")
        ) {
          images.push(convertedUrl);
        }
      } else if (typeof link === "object" && link !== null) {
        // Support object format: { url: "...", type: "video" | "image" }
        const url = link.url || link.URL || link;
        const type = link.type || link.Type;
        const isVideo = type === "video" || isVideoUrl(url);
        const convertedUrl =
          typeof url === "string" ? convertGoogleDriveUrl(url, isVideo) : url;

        if (isVideo) {
          videos.push(convertedUrl);
        } else {
          images.push(convertedUrl);
        }
      }
    });

    if (images.length > 0 || videos.length > 0) {
      return { images, videos };
    }
  }

  // Try to extract from single Google Drive link (string)
  if (
    typeof locationId === "string" &&
    locationId.includes("drive.google.com")
  ) {
    const isVideo = isVideoUrl(locationId);
    const convertedUrl = convertGoogleDriveUrl(locationId, isVideo);
    if (isVideo) {
      videos.push(convertedUrl);
    } else {
      images.push(convertedUrl);
    }
    if (images.length > 0 || videos.length > 0) {
      return { images, videos };
    }
  }

  // Fallback to placeholder images
  return {
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
    ],
    videos: [],
  };
};

// Transform JSON item to product detail format
const transformProductDetail = (item: any, index: number) => {
  const msrp = parseFloat(item.MSRP?.toString().replace(/[^0-9.]/g, "") || "0");
  const releaseYear = parseInt(item["Release Year"] || "0");
  const isNew = releaseYear >= 2024;

  // Get media (images and videos) from helper function
  const { images: productImages, videos: productVideos } =
    getProductMedia(item);

  // Parse specs from JSON
  const parseSpecs = (specsString: string) => {
    const specs: Record<string, string> = {};
    if (!specsString || specsString === "Unknown") return specs;

    // Try to extract key-value pairs from the specs string
    const lines = specsString.split(/[•\n]/).filter((line) => line.trim());
    lines.forEach((line) => {
      const match = line.match(/(.+?):\s*(.+)/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        specs[key] = value;
      }
    });

    // Also add direct fields from JSON
    if (item["Unit Weight"]) specs["Weight"] = item["Unit Weight"];
    if (item["Dimensions (Standing)"])
      specs["Dimensions"] = item["Dimensions (Standing)"];
    if (item["Payload (Max)"]) specs["Payload"] = item["Payload (Max)"];
    if (item["Max Speed"]) specs["Max Speed"] = item["Max Speed"];
    if (item["Runtime"]) specs["Runtime"] = item["Runtime"];
    if (item["Battery Wh"]) specs["Battery"] = item["Battery Wh"];
    if (item["Operating Environment"])
      specs["Operating Environment"] = item["Operating Environment"];
    if (item["IP Rating"] && item["IP Rating"] !== "Unknown")
      specs["IP Rating"] = item["IP Rating"];

    return specs;
  };

  // Parse features from JSON
  const parseFeatures = (featuresString: string) => {
    if (!featuresString) return [];
    // Split by bullet points, newlines, or semicolons
    return featuresString
      .split(/[•\n;]/)
      .map((f) => f.trim())
      .filter((f) => f.length > 0 && !f.includes("contentReference"));
  };

  // Transform accessories from data.json to add-on format
  const transformAccessoriesToAddOns = () => {
    return accessoryData.accessories_addons.map((accessory) => {
      // Extract pricing
      let price = 0;
      if (
        accessory.MSRP &&
        accessory.MSRP !== "Contact Micro-IP" &&
        accessory.MSRP !== "N/A" &&
        typeof accessory.MSRP === "string"
      ) {
        const msrpValue = parseFloat(accessory.MSRP.replace(/[^0-9.]/g, ""));
        if (msrpValue > 0 && !isNaN(msrpValue)) {
          price = msrpValue;
        }
      }
      if (
        accessory["UAIS Price"] &&
        accessory["UAIS Price"] !== "N/A" &&
        price === 0
      ) {
        const uaisPrice = accessory["UAIS Price"].toString();
        const uaisValue = parseFloat(uaisPrice.replace(/[^0-9.]/g, ""));
        if (uaisValue > 0 && !isNaN(uaisValue)) {
          price = uaisValue;
        }
      }

      return {
        id: accessory["Product ID"] || accessory.SKU || accessory.name,
        name: accessory.name || "Accessory",
        price: price,
        description:
          accessory["Short Description"] || accessory.Description || "",
      };
    });
  };

  // Accessories as add-ons
  const standardAddOns = transformAccessoriesToAddOns();

  // Extract configurations from version/revision if available
  const configurations = [
    { id: "standard", name: "Standard Configuration", price: 0 },
  ];

  // If there are different versions, add them
  if (item["Version/Revision"] && item["Version/Revision"] !== "Unknown") {
    const version = item["Version/Revision"];
    if (version.includes("Pro") || version.includes("Premium")) {
      configurations.push({
        id: "premium",
        name: "Premium Configuration",
        price: msrp * 0.1,
      });
    }
  }

  return {
    id: index + 1,
    name: item["Model Name"] || "Unnamed Product",
    description: item.Description || item["Short Description"] || "",
    images: productImages,
    videos: productVideos, // Array of video URLs
    video: productVideos.length > 0 ? productVideos[0] : item.Video || null, // First video or Video field
    price: msrp,
    monthlyPrice: msrp > 0 ? msrp / 24 : 0,
    monthlyMonths: 24,
    isNew,
    options: {
      configurations,
    },
    addOns: standardAddOns,
    specs: parseSpecs(item.Specs || ""),
    features: parseFeatures(item.Features || ""),
    manufacturer: item.Manufacturer || "",
    sku: item.SKU || "",
    productId: item["Product ID"] || "",
  };
};

// Transform all products
const allProducts = buyData.map((item, index) =>
  transformProductDetail(item, index)
);

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const productId = parseInt(params.id as string);
  const product = allProducts.find((p) => p.id === productId);

  // Combine images and videos into a single media array
  const allMedia = React.useMemo(() => {
    if (!product) return [];
    const media: Array<{ type: "image" | "video"; url: string }> = [];
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((url) => media.push({ type: "image", url }));
    }
    if (product.videos && Array.isArray(product.videos)) {
      product.videos.forEach((url) => media.push({ type: "video", url }));
    }
    return media;
  }, [product]);

  const [selectedMediaIndex, setSelectedMediaIndex] = React.useState(0);
  const [selectedConfig, setSelectedConfig] = React.useState(
    product?.options.configurations[0].id || ""
  );
  const [selectedAddOns, setSelectedAddOns] = React.useState<Set<string>>(
    new Set()
  );
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [mediaLoading, setMediaLoading] = React.useState(true);
  const [showAllAddOns, setShowAllAddOns] = React.useState(false);
  const [showAllAccessories, setShowAllAccessories] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<Set<string>>(
    new Set()
  );

  React.useEffect(() => {
    if (product) {
      setSelectedConfig(product.options.configurations[0].id);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push("/services/buy")}>
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const selectedConfigData = product.options.configurations.find(
    (c) => c.id === selectedConfig
  );
  const basePrice = product.price + (selectedConfigData?.price || 0);
  const addOnsTotal = Array.from(selectedAddOns).reduce((sum, addOnId) => {
    const addOn = product.addOns.find((a) => a.id === addOnId);
    return sum + (addOn?.price || 0);
  }, 0);
  const totalPrice = basePrice + addOnsTotal;

  const handleAddToCart = () => {
    // Get selected add-ons details (from accessories)
    const selectedAccessories = Array.from(selectedAddOns)
      .map((addOnId) => {
        const addOn = product.addOns.find((a) => a.id === addOnId);
        return addOn
          ? {
              id: addOn.id,
              name: addOn.name,
              price: addOn.price,
            }
          : null;
      })
      .filter(
        (addOn): addOn is { id: string; name: string; price: number } =>
          addOn !== null
      );

    // Get selected comprehensive add-ons (from addons.ts - these don't have prices)
    const selectedComprehensiveAddOns = Array.from(selectedAddOns)
      .map((addOnId) => {
        const comprehensiveAddOn = addOns.find((a) => a.id === addOnId);
        return comprehensiveAddOn
          ? {
              id: comprehensiveAddOn.id,
              name: comprehensiveAddOn.name,
              price: 0, // Comprehensive add-ons don't have prices
            }
          : null;
      })
      .filter(
        (addOn): addOn is { id: string; name: string; price: number } =>
          addOn !== null
      );

    // Combine both types of add-ons
    const selectedAddOnsDetails = [
      ...selectedAccessories,
      ...selectedComprehensiveAddOns,
    ];

    addItem({
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: `$${totalPrice.toLocaleString()}`,
      addOns:
        selectedAddOnsDetails.length > 0 ? selectedAddOnsDetails : undefined,
      selectedConfig: selectedConfig,
    });
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: `$${totalPrice.toLocaleString()}`,
      });
    }
  };

  const handleToggleAddOn = React.useCallback((addOnId: string) => {
    setSelectedAddOns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(addOnId)) {
        newSet.delete(addOnId);
      } else {
        newSet.add(addOnId);
      }
      return newSet;
    });
  }, []);

  const currentMedia = allMedia[selectedMediaIndex];
  const isCurrentVideo = currentMedia?.type === "video";

  const nextMedia = () => {
    setSelectedMediaIndex((prev) => (prev + 1) % allMedia.length);
    setIsVideoPlaying(false);
    setMediaLoading(true);
  };

  const prevMedia = () => {
    setSelectedMediaIndex(
      (prev) => (prev - 1 + allMedia.length) % allMedia.length
    );
    setIsVideoPlaying(false);
    setMediaLoading(true);
  };

  return (
    <>
      <header className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b w-[calc(100%-var(--sidebar-width))] md:w-[calc(100%-var(--sidebar-width)-1rem)]">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/services">Services</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/services/buy">Buy</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
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
                  <video
                    src={currentMedia.url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onLoadedData={() => setMediaLoading(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                  />
                ) : currentMedia ? (
                  <>
                    {currentMedia.type === "video" ? (
                      <div className="relative w-full h-full">
                        <video
                          src={currentMedia.url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          onLoadedData={() => setMediaLoading(false)}
                        />
                        <button
                          onClick={() => setIsVideoPlaying(true)}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                        >
                          <div className="bg-white/90 rounded-full p-4">
                            <Play
                              className="size-12 text-black ml-1"
                              fill="currentColor"
                            />
                          </div>
                        </button>
                      </div>
                    ) : (
                      <Image
                        src={currentMedia.url}
                        alt={product.name}
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
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play
                              className="size-6 text-white"
                              fill="currentColor"
                            />
                          </div>
                        </>
                      ) : (
                        <Image
                          src={media.url}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Options, Details, Add-ons */}
            <div className="space-y-6">
              {/* Name and Badge */}
              <div>
                {product.isNew && (
                  <Badge className="mb-2 bg-blue-600 text-white">NEW</Badge>
                )}
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="border-t pt-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">
                    ${basePrice.toLocaleString()}
                  </span>
                  {selectedConfigData && selectedConfigData.price > 0 && (
                    <span className="text-sm text-muted-foreground">
                      + ${selectedConfigData.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.monthlyPrice > 0 && (
                  <p className="text-muted-foreground">
                    or $
                    {product.monthlyPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /mo. for {product.monthlyMonths} mo.*
                  </p>
                )}
              </div>

              {/* Configuration Options */}
              {product.options.configurations.length > 1 && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Configuration</h3>
                  <div className="space-y-2">
                    {product.options.configurations.map((config) => (
                      <button
                        key={config.id}
                        onClick={() => setSelectedConfig(config.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border-2 transition-colors",
                          selectedConfig === config.id
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-muted-foreground/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{config.name}</span>
                          {config.price > 0 && (
                            <span className="text-sm text-muted-foreground">
                              + ${config.price.toLocaleString()}
                            </span>
                          )}
                          {selectedConfig === config.id && (
                            <Check className="size-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessories */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Accessories</h3>
                <div className="space-y-3">
                  {(showAllAccessories
                    ? product.addOns
                    : product.addOns.slice(0, 3)
                  ).map((addOn) => (
                    <div
                      key={addOn.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors",
                        selectedAddOns.has(addOn.id)
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50"
                      )}
                      onClick={() => handleToggleAddOn(addOn.id)}
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedAddOns.has(addOn.id)}
                          onCheckedChange={(checked) => {
                            if (checked !== selectedAddOns.has(addOn.id)) {
                              handleToggleAddOn(addOn.id);
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{addOn.name}</span>
                          <span className="text-sm font-semibold">
                            {addOn.price > 0
                              ? `$${addOn.price.toLocaleString()}`
                              : "Contact for pricing"}
                          </span>
                        </div>
                        {addOn.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {addOn.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {product.addOns.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setShowAllAccessories(!showAllAccessories)}
                  >
                    {showAllAccessories ? (
                      <>
                        Show Less
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View All {product.addOns.length} Accessories
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Total Price */}
              {selectedAddOns.size > 0 && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-6 space-y-3">
                <Button onClick={handleAddToCart} size="lg" className="w-full">
                  Add to Cart
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
                      isInWishlist(product.id) && "fill-red-500 text-red-500"
                    )}
                  />
                  {isInWishlist(product.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </Button>
              </div>
            </div>
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
                      addOn.filters.some((filter) =>
                        selectedFilters.has(filter)
                      )
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
                            className={cn(
                              "border rounded-lg p-4 hover:shadow-md transition-shadow bg-background cursor-pointer",
                              selectedAddOns.has(addOn.id)
                                ? "border-primary bg-primary/5"
                                : "border-muted"
                            )}
                            onClick={() => handleToggleAddOn(addOn.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  checked={selectedAddOns.has(addOn.id)}
                                  onCheckedChange={(checked) => {
                                    if (
                                      checked !== selectedAddOns.has(addOn.id)
                                    ) {
                                      handleToggleAddOn(addOn.id);
                                    }
                                  }}
                                  className="mt-1"
                                />
                              </div>
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
                                  {addOn.industries
                                    .slice(0, 3)
                                    .map((industry) => (
                                      <Badge
                                        key={industry}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {industry}
                                      </Badge>
                                    ))}
                                  {addOn.industries.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
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
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
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

          {/* Bottom Section - Specs and Technical Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Specifications */}
            {Object.keys(product.specs).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b pb-2"
                      >
                        <dt className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </dt>
                        <dd className="text-muted-foreground">
                          {value as string}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {product.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="size-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
