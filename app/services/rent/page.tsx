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

  // If it's already a direct URL, return it
  if (
    url.includes("uc?export=view") ||
    url.includes("uc?export=download") ||
    url.includes("/preview")
  ) {
    return url;
  }

  // If it's a Google Drive share link, convert it
  if (url.includes("drive.google.com")) {
    const fileId = extractFileId(url);
    if (fileId) {
      if (isVideo) {
        // For videos, use the preview URL (works better for embedded playback)
        return `https://drive.google.com/file/d/${fileId}/preview`;
      } else {
        // For images, use the view link
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
  }

  // Return as-is if it's already a direct URL
  return url;
};

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  if (typeof url !== "string") return false;
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Helper function to get the first image or video from arrays
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProductImage = (rental: any): { url: string; isVideo: boolean } => {
  // Check if images array exists and has items
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

  // If no images, check videos array
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

  // Fallback to placeholder
  return {
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    isVideo: false,
  };
};

// Transform rental data to ProductCard format
const transformRentals = () => {
  return rentalData.rentals.map((rental, index) => {
    // Get ID from various possible fields
    const id =
      rental.id || rental.SKU || rental["Product ID"] || `rental-${index}`;

    // Get name from various possible fields
    const rentalData = rental as Record<string, unknown>;
    const name =
      rental.name ||
      (rentalData["Model Name"] as string) ||
      (rentalData["Short Description"] as string) ||
      "Unnamed Rental";

    // Get pricing from various possible fields (same logic as detail page)
    const dailyPrice =
      rental.pricing?.daily_usd ||
      parseFloat(
        (rental["Rental Price (Daily)"] || "")
          .toString()
          .replace(/[^0-9.]/g, "")
      ) ||
      null;
    const depositAmount =
      parseFloat(
        (rental["Deposit Required"] || "").toString().replace(/[^0-9.]/g, "")
      ) || null;
    const depositPercent =
      rental.pricing?.deposit_percent ||
      (depositAmount && dailyPrice
        ? Math.round((depositAmount / (dailyPrice * 30)) * 100 * 10) / 10
        : 0);

    let price = "Contact for pricing";
    let monthlyPrice = rental.availability || "";

    if (dailyPrice) {
      const monthlyEstimate = dailyPrice * 30;
      price = `From $${dailyPrice.toLocaleString()}/day`;
      monthlyPrice =
        monthlyEstimate > 0
          ? `~$${Math.round(
              monthlyEstimate
            ).toLocaleString()}/mo • ${depositPercent}% deposit`
          : rental.availability || "";
    } else if (
      rental.pricing &&
      typeof rental.pricing === "object" &&
      "model" in rental.pricing &&
      rental.pricing.model
    ) {
      price = String((rental.pricing as Record<string, unknown>).model);
    }

    const { url: imageUrl, isVideo: imageIsVideo } = getProductImage(rental);

    // Get year from various possible fields
    const year = rental.year || parseInt(rental["Release Year"] || "0") || null;

    // Get manufacturer from various possible fields
    const manufacturer =
      rental.manufacturer || (rentalData["Manufacturer"] as string) || "";

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

// Hero media configuration - Add your custom hero images/videos here
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

  Events: [
    // Add images/videos for "Events" tab here
    "/rent/events/kinetics.mp4",
    "/rent/events/robo-bar.mp4",
    "/rent/events/show.mp4",
    "/rent/events/kinetics.mp4",
  ],
  Entertainment: [
    // Add images/videos for "Entertainment" tab here
  ],
  Healthcare: [
    // Add images/videos for "Healthcare" tab here
  ],
  Industrial: [
    // Add images/videos for "Industrial" tab here
  ],
  Retail: [
    // Add images/videos for "Retail" tab here
  ],
};

// Categorize rental products based on category field in data.json
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categorizeRental = (rental: any): string[] => {
  const categories: string[] = [];

  // Get category from rental data (can be string or array)
  const rentalCategory = rental.category || rental.Category || "";
  const categoryStr = Array.isArray(rentalCategory)
    ? rentalCategory.join(" ").toLowerCase()
    : String(rentalCategory).toLowerCase();

  const name = (rental.name || "").toLowerCase();

  // Map category field values to our tab categories
  // Robot Type Categories
  if (
    categoryStr.includes("quadruped") ||
    name.includes("go2") ||
    name.includes("quadruped")
  ) {
    categories.push("Quadruped Robots");
  } else if (
    categoryStr.includes("humanoid") ||
    name.includes("humanoid") ||
    name.includes("g1") ||
    name.includes("r1") ||
    name.includes("h1")
  ) {
    categories.push("Humanoid Robots");
  } else if (
    categoryStr.includes("hand") ||
    categoryStr.includes("manipulator") ||
    categoryStr.includes("hardware") ||
    categoryStr.includes("module") ||
    categoryStr.includes("component")
  ) {
    categories.push("Hardware & Components");
  }

  // Industry/Use Case Categories - check category field directly
  if (categoryStr.includes("event") || categoryStr === "events") {
    categories.push("Events");
  }
  if (
    categoryStr.includes("entertainment") ||
    categoryStr === "entertainment"
  ) {
    categories.push("Entertainment");
  }
  if (
    categoryStr.includes("healthcare") ||
    categoryStr.includes("medical") ||
    categoryStr.includes("health") ||
    categoryStr === "healthcare"
  ) {
    categories.push("Healthcare");
  }
  if (categoryStr.includes("industrial") || categoryStr === "industrial") {
    categories.push("Industrial");
  }
  if (categoryStr.includes("retail") || categoryStr === "retail") {
    categories.push("Retail");
  }

  return categories;
};

export default function RentPage() {
  const { state, isMobile } = useSidebar();
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [heroIndex, setHeroIndex] = React.useState(0);

  // Get featured images for hero slider based on active tab
  const heroImages = React.useMemo(() => {
    // First, check if custom images are configured for this tab
    const customImages = heroImagesConfig[activeTab];
    if (customImages && customImages.length > 0) {
      return customImages;
    }

    // Fallback to product images if no custom images configured
    const seen = new Set<string>();
    const productsToUse = rentalProducts.filter((product) => {
      const rental = rentalData.rentals.find((r) => r.id === product.id);
      if (!rental) return false;
      const categories = categorizeRental(rental);
      return activeTab === "all" || categories.includes(activeTab);
    });

    const imagesList = productsToUse
      .filter((p) => p.image && !seen.has(p.image))
      .map((p) => {
        seen.add(p.image);
        return p.image;
      })
      .slice(0, 5);

    return imagesList.length > 0
      ? imagesList
      : [
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80",
        ];
  }, [activeTab]);

  // Reset hero index when tab changes
  React.useEffect(() => {
    setHeroIndex(0);
  }, [activeTab]);

  // Auto-advance hero slider
  React.useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Get all available tab categories
  const tabCategories = React.useMemo(() => {
    const categorySet = new Set<string>();
    rentalData.rentals.forEach((rental) => {
      const categories = categorizeRental(rental);
      categories.forEach((cat) => categorySet.add(cat));
    });
    return ["all", ...Array.from(categorySet).sort()];
  }, []);

  // Calculate header left position based on sidebar state
  const getHeaderLeft = () => {
    if (isMobile) return "0";
    // When collapsed in icon mode with floating variant, sidebar is ~4rem (3rem icon + 1rem padding)
    // When expanded, sidebar is 19rem wide (from layout)
    return state === "collapsed" ? "4rem" : "19rem";
  };

  const getHeaderWidth = () => {
    if (isMobile) return "100vw";
    return state === "collapsed" ? "calc(100% - 4rem)" : "calc(100% - 19rem)";
  };

  return (
    <>
      <header
        className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b transition-[left,width] duration-200 ease-linear"
        style={{
          left: getHeaderLeft(),
          width: getHeaderWidth(),
        }}
      >
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
              <BreadcrumbItem>
                <BreadcrumbPage>Rent</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <WishlistIcon />
          <CartIcon />
        </div>
      </header>
      {/* Hero Slider Section - Positioned below header */}
      <div
        className="relative w-full max-w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
        style={{
          marginTop: "4rem", // Height of header
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${heroIndex}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {isVideoUrl(heroImages[heroIndex] || heroImages[0]) ? (
              <video
                key={`${activeTab}-${heroIndex}`}
                src={heroImages[heroIndex] || heroImages[0]}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                onError={() => {
                  console.error("Video failed to load:", heroImages[heroIndex]);
                }}
              />
            ) : (
              <Image
                src={heroImages[heroIndex] || heroImages[0]}
                alt={`Featured ${activeTab === "all" ? "Rental" : activeTab}`}
                fill
                className="object-cover"
                priority={heroIndex === 0}
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Only show if more than one image */}
        {heroImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setHeroIndex(
                  (prev) => (prev - 1 + heroImages.length) % heroImages.length
                )
              }
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white transition-all hover:scale-110 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() =>
                setHeroIndex((prev) => (prev + 1) % heroImages.length)
              }
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white transition-all hover:scale-110 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Dots Indicator - Only show if more than one image */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setHeroIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === heroIndex
                    ? "bg-white w-8"
                    : "bg-white/50 w-2 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end justify-center pb-12 md:pb-16 lg:pb-20 z-10">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-white px-4 max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 drop-shadow-2xl">
              {activeTab === "all" ? "Rent Robots" : activeTab}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-lg">
              {activeTab === "all"
                ? "Flexible rental options for your business needs."
                : `Explore our ${activeTab.toLowerCase()} rental collection`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 min-w-0 pt-8 max-w-full overflow-x-hidden">
        <div className="w-full min-w-0 max-w-full">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-full"
          >
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              <TabsList className="w-full md:w-auto justify-start h-auto p-1 bg-muted/50 inline-flex min-w-max">
                {tabCategories.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="px-4 md:px-6 py-2 text-sm md:text-base data-[state=active]:bg-background whitespace-nowrap shrink-0"
                  >
                    {tab === "all" ? "All Products" : tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Contents */}
            {tabCategories.map((tab) => {
              const tabProducts =
                tab === "all"
                  ? rentalProducts
                  : rentalProducts.filter((product) => {
                      const rental = rentalData.rentals.find(
                        (r) => r.id === product.id
                      );
                      if (!rental) return false;
                      const categories = categorizeRental(rental);
                      return categories.includes(tab);
                    });

              return (
                <TabsContent key={tab} value={tab} className="mt-0">
                  {/* Results count */}
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground">
                      Showing {tabProducts.length}{" "}
                      {tabProducts.length === 1 ? "product" : "products"}
                      {tab !== "all" && ` in ${tab}`}
                    </p>
                  </div>

                  {tabProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch w-full max-w-full">
                      {tabProducts.map((product, index) => (
                        <ProductCard
                          key={product.id || `rental-${index}`}
                          id={product.id || `rental-${index}`}
                          name={product.name}
                          image={product.image}
                          alt={product.alt}
                          price={product.price}
                          monthlyPrice={product.monthlyPrice}
                          isNew={product.isNew}
                          isVideo={product.isVideo}
                          linkPath={`/services/rent/${
                            product.id || `rental-${index}`
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No rentals available in this category.
                      </p>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </>
  );
}
