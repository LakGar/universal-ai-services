"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ProductCard } from "@/components/ui/product-card";
import { CartIcon } from "@/components/cart-icon";
import { WishlistIcon } from "@/components/wishlist-icon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import rentalData from "@/app/data.json";

// Helper function to extract file ID from Google Drive URL
const extractFileId = (url: string): string | null => {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
};

// Helper function to convert Google Drive URL to direct view URL
const convertGoogleDriveUrl = (
  url: string,
  isVideo: boolean = false
): string => {
  if (!url || typeof url !== "string") return url;

  if (
    url.includes("uc?export=view") ||
    url.includes("uc?export=download") ||
    url.includes("/preview")
  ) {
    return url;
  }

  if (url.includes("drive.google.com")) {
    const fileId = extractFileId(url);
    if (fileId) {
      if (isVideo) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      } else {
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

// Helper function to get the first image or video from arrays
const getProductImage = (rental: any): { url: string; isVideo: boolean } => {
  if (
    rental.images &&
    Array.isArray(rental.images) &&
    rental.images.length > 0
  ) {
    const firstImage = rental.images[0];
    if (typeof firstImage === "string") {
      return { url: convertGoogleDriveUrl(firstImage, false), isVideo: false };
    }
  }

  if (
    rental.videos &&
    Array.isArray(rental.videos) &&
    rental.videos.length > 0
  ) {
    const firstVideo = rental.videos[0];
    if (typeof firstVideo === "string") {
      return { url: convertGoogleDriveUrl(firstVideo, true), isVideo: true };
    }
  }

  return {
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    isVideo: false,
  };
};

/**
 * TRANSFORM RENTALS
 * Updated to force "Contact for pricing"
 */
const transformRentals = () => {
  return rentalData.rentals.map((rental, index) => {
    const id = rental.id || rental.SKU || rental["Product ID"] || `rental-${index}`;
    const rentalDataObj = rental as Record<string, unknown>;
    
    const name =
      rental.name ||
      (rentalDataObj["Model Name"] as string) ||
      (rentalDataObj["Short Description"] as string) ||
      "Unnamed Rental";

    // UPDATED LOGIC: Primary price is always "Contact for pricing"
    const price = "Contact for pricing";
    
    // Secondary info shows availability (e.g., "On demand" or "In Stock")
    const monthlyPrice = rental.availability || (rentalDataObj["Stock Status"] as string) || "";

    const { url: imageUrl, isVideo: imageIsVideo } = getProductImage(rental);

    const year = rental.year || parseInt(rental["Release Year"] || "0") || null;
    const manufacturer = rental.manufacturer || (rentalDataObj["Manufacturer"] as string) || "";

    return {
      id,
      name,
      image: imageUrl,
      alt: name,
      price,
      monthlyPrice,
      isNew: year === 2025 || year === 2024,
      isVideo: imageIsVideo,
      manufacturer,
    };
  });
};

const rentalProducts = transformRentals();

// Hero media configuration
const heroImagesConfig: Record<string, string[]> = {
  all: [
    "https://www.unitree.com/images/b5fffd3e4fc04e6f9fcafedb9516b341_3840x2146.jpg",
    "https://www.unitree.com/images/6111f13fbb954948bdb1ca4e13857872.mp4",
    "https://oss-global-cdn.unitree.com/static/3fded0fc587046fd96077e79b2d2776d.mp4",
    "https://www.unitree.com/images/a89249d4e2284243b8379205259bcd0c_1920x1877.png",
  ],
  "Quadruped Robots": [
    "https://www.unitree.com/images/e1aaf5c6b9564c02a2542c30b369ee17.mp4",
    "https://oss-global-cdn.unitree.com/static/320b50c0880d4466bca8beb56aa73abd_1620x816.png",
    "https://oss-global-cdn.unitree.com/static/8d0499fb40d1421fb13ce906ffd0a8d4.mp4",
  ],
  "Humanoid Robots": [
    "https://www.unitree.com/images/efca9764a6de42108d6e2effc75944aa_3840x2160.jpg",
    "https://www.unitree.com/images/7504897529034b05890225e149d3af28.mp4",
    "https://www.unitree.com/images/fadc6f0bc26747d6b4110fd5e5657857.mp4",
  ],
  "Hardware & Components": [
    "https://www.unitree.com/images/a81cbcb21ad7498eaf11f5c15c31d07e_1920x1080.jpg?x-oss-process=image/format,webp",
    "https://oss-global-cdn.unitree.com/static/615cd786abe14f5ebe64482b963cb092.mp4",
    "https://www.unitree.com/images/52688de58de044358e4792a5b7c1593d_2740x1720.jpg",
  ],
  Events: ["/rent/events/kinetics.mp4", "/rent/events/robo-bar.mp4", "/rent/events/show.mp4"],
  Entertainment: [],
  // Add images/videos for "Entertainment" tab here
  Healthcare: [],
  // Add images/videos for "Healthcare" tab here
  Industrial: [],
  // Add images/videos for "Industrial" tab here
  Retail: [],
  // Add images/videos for "Retail" tab here
};
// Categorize rental products based on category field in data.json
const categorizeRental = (rental: any): string[] => {
  const categories: string[] = [];
  const rentalCategory = rental.category || rental.Category || "";
  const categoryStr = Array.isArray(rentalCategory)
    ? rentalCategory.join(" ").toLowerCase()
    : String(rentalCategory).toLowerCase();
  const name = (rental.name || "").toLowerCase();

  if (categoryStr.includes("quadruped") || name.includes("go2") || name.includes("quadruped")) {
    categories.push("Quadruped Robots");
  } else if (categoryStr.includes("humanoid") || name.includes("humanoid") || name.includes("g1") || name.includes("h1")) {
    categories.push("Humanoid Robots");
  } else if (categoryStr.includes("hand") || categoryStr.includes("hardware") || categoryStr.includes("component")) {
    categories.push("Hardware & Components");
  }

  if (categoryStr.includes("event")) categories.push("Events");
  if (categoryStr.includes("entertainment")) categories.push("Entertainment");
  if (categoryStr.includes("healthcare") || categoryStr.includes("medical")) categories.push("Healthcare");
  if (categoryStr.includes("industrial")) categories.push("Industrial");
  if (categoryStr.includes("retail")) categories.push("Retail");

  return categories;
};

export default function RentPage() {
  const { state, isMobile } = useSidebar();
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [heroIndex, setHeroIndex] = React.useState(0);

  const heroImages = React.useMemo(() => {
    const customImages = heroImagesConfig[activeTab];
    if (customImages && customImages.length > 0) return customImages;

    const productsToUse = rentalProducts.filter((product) => {
      const rental = rentalData.rentals.find((r) => r.id === product.id);
      if (!rental) return false;
      const categories = categorizeRental(rental);
      return activeTab === "all" || categories.includes(activeTab);
    });

    const imagesList = productsToUse.filter((p) => p.image).map((p) => p.image).slice(0, 5);
    return imagesList.length > 0 ? imagesList : ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80"];
  }, [activeTab]);

  React.useEffect(() => { setHeroIndex(0); }, [activeTab]);

  React.useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => { setHeroIndex((prev) => (prev + 1) % heroImages.length); }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const tabCategories = React.useMemo(() => {
    const categorySet = new Set<string>();
    rentalData.rentals.forEach((rental) => {
      const categories = categorizeRental(rental);
      categories.forEach((cat) => categorySet.add(cat));
    });
    return ["all", ...Array.from(categorySet).sort()];
  }, []);

  const getHeaderLeft = () => isMobile ? "0" : (state === "collapsed" ? "4rem" : "19rem");
  const getHeaderWidth = () => isMobile ? "100vw" : (state === "collapsed" ? "calc(100% - 4rem)" : "calc(100% - 19rem)");

  return (
    <>
      <header
        className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b transition-[left,width] duration-200 ease-linear"
        style={{ left: getHeaderLeft(), width: getHeaderWidth() }}
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block"><BreadcrumbLink>Services</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Rent</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <WishlistIcon />
          <CartIcon />
        </div>
      </header>

      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden mt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${heroIndex}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {isVideoUrl(heroImages[heroIndex]) ? (
              <video src={heroImages[heroIndex]} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <Image src={heroImages[heroIndex]} alt="Hero" fill className="object-cover" priority sizes="100vw" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/30" />
          </motion.div>
        </AnimatePresence>

        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, index) => (
              <button key={index} onClick={() => setHeroIndex(index)} className={`h-2 rounded-full transition-all duration-300 ${index === heroIndex ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/70"}`} />
            ))}
          </div>
        )}

        <div className="absolute inset-0 flex items-end justify-center pb-12 md:pb-16 lg:pb-20 z-10">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              {activeTab === "all" ? "Rent Robots" : activeTab}
            </h1>
            <p className="text-lg md:text-xl text-white/90">Flexible rental options for your business needs.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-8 overflow-x-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="bg-muted/50 p-1 mb-6">
              {tabCategories.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="px-6 py-2">
                  {tab === "all" ? "All Products" : tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabCategories.map((tab) => {
            const tabProducts = tab === "all" 
              ? rentalProducts 
              : rentalProducts.filter(p => {
                  const r = rentalData.rentals.find(x => x.id === p.id);
                  return r && categorizeRental(r).includes(tab);
                });

            return (
              <TabsContent key={tab} value={tab}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tabProducts.map((product) => (
                    <ProductCard key={product.id} {...product} linkPath={`/services/rent/${product.id}`} />
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </>
  );
}