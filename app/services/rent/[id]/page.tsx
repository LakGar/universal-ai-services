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
import { logger } from "@/lib/logger";
import rentalData from "@/app/data.json";
import { addOns, getAllFilters } from "../../buy/data/addons";

/**
 * HELPER FUNCTIONS
 */
const extractFileId = (url: string): string | null => {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
};

const convertGoogleDriveUrl = (url: string, isVideo: boolean = false): string => {
  if (!url || typeof url !== "string") return url;
  if (url.includes("uc?export=view") || url.includes("uc?export=download") || url.includes("/preview")) {
    return url;
  }
  if (url.includes("drive.google.com")) {
    const fileId = extractFileId(url);
    if (fileId) {
      return isVideo 
        ? `https://drive.google.com/file/d/${fileId}/preview` 
        : `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return url;
};

const getRentalById = (id: string) => {
  return rentalData.rentals.find((rental) => 
    rental.id === id || rental.SKU === id || rental["Product ID"] === id
  );
};

export default function RentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const rentalId = params.id as string;
  const rental = getRentalById(rentalId);

  // Constants
  const CONTACT_PRICE = "Contact for pricing";

  // State
  const [selectedMediaIndex, setSelectedMediaIndex] = React.useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [mediaLoading, setMediaLoading] = React.useState(true);
  const [thumbnailLoading, setThumbnailLoading] = React.useState<Set<number>>(new Set());
  const [showAllAddOns, setShowAllAddOns] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<Set<string>>(new Set());

  // Media Processing
  const allMedia = React.useMemo(() => {
    if (!rental) return [];
    const media: Array<{ type: "image" | "video"; url: string }> = [];
    if (rental.images && Array.isArray(rental.images)) {
      rental.images.forEach((url) => media.push({ type: "image", url: convertGoogleDriveUrl(url, false) }));
    }
    if (rental.videos && Array.isArray(rental.videos)) {
      rental.videos.forEach((url) => media.push({ type: "video", url: convertGoogleDriveUrl(url, true) }));
    }
    return media;
  }, [rental]);

  React.useEffect(() => {
    const loadingSet = new Set<number>();
    allMedia.forEach((_, index) => loadingSet.add(index));
    setThumbnailLoading(loadingSet);
  }, [allMedia]);

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

  const rentalDataObj = rental as Record<string, unknown>;
  const rentalName = rental.name || (rentalDataObj["Model Name"] as string) || "Rental";
  const rentalDescription = rental.description || (rentalDataObj["Description"] as string) || "";
  const rentalYear = rental.year || parseInt(rental["Release Year"] || "0") || null;
  const itemId = rental.id || rental.SKU || rental["Product ID"] || "";

  // Handlers
  const handleAddToCart = () => {
    addItem({
      id: itemId,
      name: rentalName,
      image: allMedia[0]?.url || "",
      price: CONTACT_PRICE,
      isRent: true,
    });
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(itemId)) {
      removeFromWishlist(itemId);
    } else {
      addToWishlist({
        id: itemId,
        name: rentalName,
        image: allMedia[0]?.url || "",
        price: CONTACT_PRICE,
      });
    }
  };

  // Specs & Features Parsing
  const formatSpecs = () => {
    const formatted: Record<string, string> = {};
    if (rental.specs && typeof rental.specs === "object" && !Array.isArray(rental.specs)) {
      Object.entries(rental.specs).forEach(([k, v]) => formatted[k.replace(/_/g, " ")] = String(v));
    }
    const specFields = ["Unit Weight", "Payload (Max)", "Max Speed", "Runtime", "IP Rating"];
    specFields.forEach((field) => {
      const val = (rental as Record<string, any>)[field];
      if (val && val !== "Unknown") formatted[field] = String(val);
    });
    return formatted;
  };

  const parseFeatures = () => {
    if (Array.isArray(rental.features)) return rental.features;
    const featStr = (rental.Features || rentalDataObj.features) as string;
    return featStr ? featStr.replace(/<br\s*\/?>/gi, ";").split(/[;•]/).map(f => f.trim()).filter(Boolean) : [];
  };

  const specs = formatSpecs();
  const features = parseFeatures();
  const currentMedia = allMedia[selectedMediaIndex];

  return (
    <>
      <header className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b w-[calc(100%-var(--sidebar-width))] md:w-[calc(100%-var(--sidebar-width)-1rem)]">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block"><BreadcrumbLink href="/services">Services</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block"><BreadcrumbLink href="/services/rent">Rent</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>{rentalName}</BreadcrumbPage></BreadcrumbItem>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* MEDIA SECTION */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                {mediaLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
                {isVideoPlaying && currentMedia?.type === "video" ? (
                  <iframe src={currentMedia.url} className="w-full h-full border-0" allow="autoplay; fullscreen" allowFullScreen onLoad={() => setMediaLoading(false)} />
                ) : currentMedia ? (
                  <>
                    {currentMedia.type === "video" ? (
                      <div className="relative w-full h-full">
                        <video src={currentMedia.url.replace("/preview", "/view")} className="w-full h-full object-cover" muted playsInline />
                        <button onClick={() => setIsVideoPlaying(true)} className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                          <div className="bg-white/90 rounded-full p-4"><Play className="size-12 text-black ml-1" fill="currentColor" /></div>
                        </button>
                      </div>
                    ) : (
                      <Image src={currentMedia.url} alt={rentalName} fill className={cn("object-cover", mediaLoading ? "opacity-0" : "opacity-100")} onLoad={() => setMediaLoading(false)} />
                    )}
                  </>
                ) : null}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {allMedia.map((media, idx) => (
                  <button key={idx} onClick={() => { setSelectedMediaIndex(idx); setIsVideoPlaying(false); setMediaLoading(true); }} className={cn("relative aspect-square rounded-lg overflow-hidden border-2", selectedMediaIndex === idx ? "border-primary" : "border-transparent")}>
                    <Image src={media.url.replace("/preview", "/view")} alt="thumbnail" fill className="object-cover" />
                    {media.type === "video" && <Play className="absolute inset-0 m-auto size-6 text-white" fill="currentColor" />}
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="space-y-6">
              <div>
                {(rentalYear === 2025 || rentalYear === 2024) && <Badge className="mb-2 bg-blue-600 text-white">NEW</Badge>}
                <h1 className="text-4xl font-bold mb-4">{rentalName}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">{rentalDescription}</p>
              </div>

              <div className="border-t pt-6">
                <p className="text-3xl font-bold text-primary">{CONTACT_PRICE}</p>
                <div className="mt-4 space-y-1">
                  {rental.availability && <p className="text-sm text-muted-foreground">Availability: {rental.availability}</p>}
                  {rental["Minimum Rental Period"] && <p className="text-sm text-muted-foreground">Min Rental: {rental["Minimum Rental Period"]}</p>}
                </div>
              </div>

              <div className="border-t pt-6 space-y-3">
                <Button onClick={() => { handleAddToCart(); router.push("/checkout/consultation"); }} size="lg" className="w-full">
                  Schedule Consultation & Add to Cart
                </Button>
                <Button onClick={handleToggleWishlist} variant="outline" size="lg" className="w-full">
                  <Heart className={cn("mr-2 size-5", isInWishlist(itemId) && "fill-red-500 text-red-500")} />
                  {isInWishlist(itemId) ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </div>
          </div>

          {/* SPECS & FEATURES CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.keys(specs).length > 0 && (
              <Card><CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
                <CardContent><dl className="space-y-3">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b pb-2"><dt className="font-medium capitalize">{k}</dt><dd className="text-muted-foreground">{v}</dd></div>
                  ))}
                </dl></CardContent>
              </Card>
            )}
            {features.length > 0 && (
              <Card><CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
                <CardContent><ul className="space-y-2">
                  {features.map((f, i) => (<li key={i} className="flex items-start gap-2"><Check className="size-5 text-primary shrink-0 mt-0.5" /><span>{f}</span></li>))}
                </ul></CardContent>
              </Card>
            )}
          </div>

          {/* ADD-ONS SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
             <h2 className="text-3xl font-semibold mb-6">Robot Add-ons & Features</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {addOns.slice(0, showAllAddOns ? undefined : 6).map((addOn) => (
                  <div key={addOn.id} className="border rounded-lg p-4 bg-background">
                    <span className="text-2xl">{addOn.emoji}</span>
                    <h4 className="font-semibold mt-2">{addOn.name}</h4>
                    <p className="text-xs text-muted-foreground">{addOn.description}</p>
                  </div>
                ))}
             </div>
             <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => setShowAllAddOns(!showAllAddOns)}>
                  {showAllAddOns ? "Show Less" : "View All Add-ons"}
                </Button>
             </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}