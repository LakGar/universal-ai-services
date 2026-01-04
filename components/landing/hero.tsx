"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useState, useEffect, useMemo, useRef } from "react";
import Script from "next/script";
import { X, CheckCircle, BarChart3, Globe2, Calendar } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import { logger } from "@/lib/logger";
import { RobotCards } from "@/components/ui/robot-cards";
import { RobotCardsMobile } from "@/components/ui/robot-cards-mobile";
import buyData from "@/app/services/buy/data/buy_data.json";
import rentalData from "@/app/data.json";

// ============================================================================
// HERO ROBOT CARDS CONFIGURATION
// ============================================================================
// Configure the 7 robots you want to display in the hero section
// Leave empty array [] to use the first 7 "Buy" category items (default behavior)
//
// Configuration format:
// {
//   productId: string,        // Product ID from buy_data.json or data.json rentals
//   type: "buy" | "rent",     // Whether it's from buy or rent data
//   image?: string            // Optional: Custom image URL (overrides product image)
// }
//
// Example:
// [
//   { productId: "GO2-PRO-0001", type: "buy" },
//   { productId: "UNITREE-GO2-PRO-RENT", type: "rent", image: "/custom-image.jpg" },
//   ...
// ]
interface HeroRobotConfig {
  productId: string;
  type: "buy" | "rent";
  image?: string; // Optional custom image URL
  name?: string; // Optional custom name (overrides product name)
}

const HERO_ROBOT_CONFIG: HeroRobotConfig[] = [
  // Add your 7 robot configurations here:
  {
    productId: "GO2-PRO-0001",
    type: "buy",
    image:
      "https://images.squarespace-cdn.com/content/v1/5e76e0c52a318c0c1a850442/1693706482840-464SIORTG1VDG0KPM3DO/picture+of+GO2-13.jpg?format=1500w",
  },
  {
    productId: "GO2-PRO-0001-CONSTRUCTION",
    name: "Go2 Construction",
    type: "buy",
    image:
      "https://d2cdo4blch85n8.cloudfront.net/wp-content/uploads/2023/12/Unitree-B2-Industrial-Quadruped-Robot-1-1024x683.jpg",
  },
  {
    productId: "ROBO-BAR-RENT-0001",
    type: "rent",
    image:
      "https://globetrender.com/wp-content/uploads/2021/11/9Makr-Shakr-Amsterdam_Riccardo-De-Vecchi-Credits-scaled.jpg",
  },
  {
    productId: "UAIS-AIRPORT-ROBOT-0001",
    name: "Airport Robot",
    type: "rent",
    image: "https://www.opendroids.com/assets/images/service/airport-1.webp",
  },
  {
    productId: "ROBO-LIGHTS-RENT-0001",
    type: "rent",
    image:
      "https://static.designboom.com/wp-content/dbsub/381292/2021-07-26/when-robots-compose-poetry-tetro-presents-the-new-kinetic-sculpture-created-by-collectif-scale-1-60feb7b88cf2c.jpg",
  },

  {
    productId: "UAIS-RETAIL-ROBOT-0001",
    name: "Retail Robot",
    type: "rent",
    image: "https://www.opendroids.com/assets/images/service/retail-1.webp",
  },
  {
    productId: "UAIS-WAREHOUSE-ROBOT-0001",
    name: "Warehouse Robot",
    type: "rent",
    image: "https://www.opendroids.com/assets/images/service/warehouse-1.webp",
  },
  // { productId: "GO2-PRO-0001", type: "buy" },
  // { productId: "UNITREE-GO2-PRO-RENT", type: "rent" },
  // { productId: "H1-EDU-0001", type: "buy", image: "/custom-hero-image.jpg" },
];
// ============================================================================

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  if (typeof url !== "string") return false;
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Helper function to extract file ID from Google Drive URL
const extractFileId = (url: string): string | null => {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
};

// Helper function to get image from Google Drive or use provided images
// Using the exact same logic as the buy page
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProductImage = (item: any): string => {
  // If Images field exists and has URLs, use the first one
  if (item.Images && Array.isArray(item.Images) && item.Images.length > 0) {
    const firstImage = item.Images[0];
    // Skip if it's a video
    if (typeof firstImage === "string" && !isVideoUrl(firstImage)) {
      return firstImage;
    }
  }
  if (
    item.Images &&
    typeof item.Images === "string" &&
    !isVideoUrl(item.Images)
  ) {
    return item.Images;
  }

  // Check if Location ID is an array of Google Drive links
  const locationId = item["Location ID"];
  if (Array.isArray(locationId) && locationId.length > 0) {
    // Find first non-video item
    for (const link of locationId) {
      if (typeof link === "string") {
        // Skip videos
        if (isVideoUrl(link)) continue;

        if (link.includes("drive.google.com")) {
          const fileId = extractFileId(link);
          if (fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
          }
        } else if (link.startsWith("http")) {
          // Direct image URL
          return link;
        }
      }
    }
  }

  // Try to extract from single Google Drive link (string)
  if (
    typeof locationId === "string" &&
    locationId.includes("drive.google.com") &&
    !isVideoUrl(locationId)
  ) {
    const fileId = extractFileId(locationId);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  // Fallback to placeholder
  return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
};

// Helper function to get rental image (similar to rent page logic)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRentalImage = (rental: any): string => {
  // Check if images array exists and has items
  if (
    rental.images &&
    Array.isArray(rental.images) &&
    rental.images.length > 0
  ) {
    // Find first non-video image
    for (const img of rental.images) {
      if (typeof img === "string" && !isVideoUrl(img)) {
        // Convert Google Drive URL if needed
        if (img.includes("drive.google.com")) {
          const fileId = extractFileId(img);
          if (fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
          }
        }
        return img;
      }
    }
  }

  // Check if images field exists as string
  if (
    rental.images &&
    typeof rental.images === "string" &&
    !isVideoUrl(rental.images)
  ) {
    if (rental.images.includes("drive.google.com")) {
      const fileId = extractFileId(rental.images);
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
    return rental.images;
  }

  // Fallback to placeholder
  return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
};

// Transform buy/rent data to robot cards format
const transformRobots = () => {
  // If HERO_ROBOT_CONFIG is configured, use those specific products
  if (HERO_ROBOT_CONFIG.length > 0) {
    return HERO_ROBOT_CONFIG.slice(0, 7).map((config, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let item: any = null;
      let name = "Robot";
      let image = "";
      let url = "";

      if (config.type === "buy") {
        // Find in buy data
        item = buyData.find(
          (i) => i.Category === "Buy" && i["Product ID"] === config.productId
        );
        if (item) {
          name = config.name || item["Model Name"] || "Robot";
          image = config.image || getProductImage(item);
          // Find the index in the full buyData array for the detail page
          const fullIndex = buyData.findIndex(
            (p) => p["Product ID"] === item["Product ID"]
          );
          const detailPageId = fullIndex >= 0 ? fullIndex + 1 : index + 1;
          url = `/services/buy/${detailPageId}`;
        }
      } else if (config.type === "rent") {
        // Find in rental data
        item = rentalData.rentals.find(
          (r) =>
            r.id === config.productId ||
            r.SKU === config.productId ||
            r["Product ID"] === config.productId
        );
        if (item) {
          name =
            config.name ||
            item.name ||
            (item as Record<string, unknown>)["Model Name"] ||
            (item as Record<string, unknown>)["Short Description"] ||
            "Robot";
          image = config.image || getRentalImage(item);
          // Use the rental ID for the detail page
          const rentalId =
            item.id || item.SKU || item["Product ID"] || config.productId;
          url = `/services/rent/${rentalId}`;
        }
      }

      // If item not found, return placeholder
      if (!item) {
        return {
          id: index + 1,
          name: config.name || `Robot ${index + 1}`,
          image:
            config.image ||
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
          url: "#",
        };
      }

      return {
        id: index + 1,
        name,
        image,
        url,
      };
    });
  }

  // Default: Filter to only "Buy" category items and limit to 7 for hero
  const buyItems = buyData
    .filter((item) => item.Category === "Buy")
    .slice(0, 7);

  return buyItems.map((item, index) => {
    // Find the index in the full buyData array for the detail page
    // The buy detail page uses index + 1 as the ID
    const fullIndex = buyData.findIndex(
      (p) => p["Product ID"] === item["Product ID"]
    );
    const detailPageId = fullIndex >= 0 ? fullIndex + 1 : index + 1;

    return {
      id: index + 1,
      name: item["Model Name"] || "Robot",
      image: getProductImage(item),
      url: `/services/buy/${detailPageId}`,
    };
  });
};

export const Hero = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [consultationScheduled, setConsultationScheduled] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const calendlyUrl = "https://calendly.com/lakgarg2002/advisory-meeting-1";

  // Transform buy data to robots
  const robots = useMemo(() => transformRobots(), []);

  const handleExpand = () => setIsExpanded(true);

  const handleClose = () => {
    setIsExpanded(false);
  };

  // Reset consultation scheduled state when modal closes
  useEffect(() => {
    if (!isExpanded) {
      setTimeout(() => {
        setConsultationScheduled(false);
      }, 500);
    }
  }, [isExpanded]);

  // Initialize Calendly widget when modal opens and script is loaded
  useEffect(() => {
    if (!isExpanded || !widgetRef.current) return;

    const initWidget = () => {
      if (!widgetRef.current) return;

      // Clear any existing content
      widgetRef.current.innerHTML = "";

      // Initialize the widget if Calendly is available
      if ((window as any).Calendly?.initInlineWidget) {
        try {
          (window as any).Calendly.initInlineWidget({
            url: calendlyUrl,
            parentElement: widgetRef.current,
          });
        } catch (error) {
          logger.error(
            "Error initializing Calendly widget",
            error instanceof Error ? error : new Error(String(error))
          );
        }
      }
    };

    // Check if Calendly is already available
    if ((window as any).Calendly?.initInlineWidget) {
      // Small delay to ensure DOM is ready
      setTimeout(initWidget, 100);
      return;
    }

    // If script is loaded but Calendly isn't ready yet, wait for it
    if (scriptLoaded) {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds
      const checkInterval = setInterval(() => {
        attempts++;
        if ((window as any).Calendly?.initInlineWidget) {
          clearInterval(checkInterval);
          setTimeout(initWidget, 100);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          logger.error(
            "Calendly script loaded but failed to initialize",
            new Error("Calendly initialization timeout")
          );
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, [isExpanded, scriptLoaded, calendlyUrl]);

  // Listen for Calendly event when consultation is scheduled
  useEffect(() => {
    if (!isExpanded) return;

    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data?.event && e.data.event.indexOf("calendly") === 0) {
        if (e.data.event === "calendly.event_scheduled") {
          setConsultationScheduled(true);
        }
      }
    };

    window.addEventListener("message", handleCalendlyEvent);

    return () => {
      window.removeEventListener("message", handleCalendlyEvent);
    };
  }, [isExpanded]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  return (
    <>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col items-center justify-center px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-4xl md:text-center"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Robotics
            </span>{" "}
            Marketplace, Engineering Lab & Consultancy
          </motion.h1>

          {/* Robot Cards */}
          <div className="w-full max-w-5xl mx-auto ">
            <RobotCards robots={robots} className="py-0" />
          </div>

          <div className=" text-black md:text-center md:text-lg dark:text-neutral-200 py-4 md:w-2/3">
            Buy, rent, deploy, and scale production-ready robotics and AI
            solutions — with expert integration when you need it.
          </div>
          <div className="flex items-center gap-4 md:justify-center w-full z-1">
            <AnimatePresence initial={false}>
              {!isExpanded && (
                <motion.div className="inline-block relative">
                  {/* The expanding background element */}
                  <motion.div
                    style={{ borderRadius: "100px" }}
                    layout
                    layoutId="cta-card"
                    className="absolute inset-0 bg-black dark:bg-white"
                  />
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout={false}
                    onClick={handleExpand}
                    className="relative flex items-center gap-2 h-12 px-6 py-2 text-base font-medium text-white dark:text-black tracking-wide hover:opacity-90 transition-opacity rounded-full"
                  >
                    Book a Consultation
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <a
              className="bg-white dark:bg-black border border-black/10 dark:border-white rounded-full w-fit text-black dark:text-white px-4 py-2"
              href="/about"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Mobile Robot Cards - Flat List - Outside motion.div to avoid overflow issues */}
        <div className="md:hidden w-full px-4 pb-8 relative z-10">
          <RobotCardsMobile robots={robots} />
        </div>
      </AuroraBackground>

      {/* 
        Expanded Modal Overlay 
      */}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              layoutId="cta-card"
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              style={{ borderRadius: "24px" }}
              layout
              className="relative flex h-full w-full overflow-hidden bg-black dark:bg-white sm:rounded-[24px] shadow-2xl"
            >
              {/* Mesh Gradient Background inside Modal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 pointer-events-none"
              >
                <MeshGradient
                  speed={0.6}
                  colors={["#000000", "#1a1a1a", "#2d2d2d", "#0a0a0a"]} // Dark palette to match button
                  distortion={0.8}
                  swirl={0.1}
                  grainMixer={0.15}
                  grainOverlay={0}
                  style={{ height: "100%", width: "100%" }}
                />
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleClose}
                className="absolute right-4 top-4 sm:right-8 sm:top-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </motion.button>

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="relative z-10 flex flex-col lg:flex-row h-full w-full max-w-7xl mx-auto overflow-y-auto lg:overflow-hidden"
              >
                {/* Left Side: Testimonials & Info */}
                <div className="hidden flex-1 md:flex flex-col justify-center p-8 sm:p-12 lg:p-16 gap-8 text-white">
                  <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                      Ready to scale?
                    </h2>
                    <p className="text-white/80 text-lg max-w-md">
                      Join forward-thinking companies building the future with
                      intelligent robotics and AI systems.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                        <BarChart3 className="w-6 h-6 text-white/70" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Production-Ready Solutions
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed mt-1">
                          Deploy and scale robotics and AI systems with expert
                          integration support.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                        <Globe2 className="w-6 h-6 text-white/70" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Expert Integration
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed mt-1">
                          Get the support you need when deploying complex AI and
                          robotics solutions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-white/20 space-y-8">
                    <figure>
                      <blockquote className="text-xl font-medium leading-relaxed mb-6">
                        &ldquo;Universal AI Services helped us deploy
                        intelligent robotics solutions that transformed our
                        manufacturing process. The expert integration support
                        made all the difference.&rdquo;
                      </blockquote>
                      <figcaption className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-lg font-bold text-white">
                          JD
                        </div>
                        <div>
                          <div className="font-semibold">John Davis</div>
                          <div className="text-sm text-white/70">
                            CTO, TechCorp
                          </div>
                        </div>
                      </figcaption>
                    </figure>

                    <div className="flex gap-3 items-start">
                      <Calendar className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/90 font-medium mb-1">
                          What to Expect
                        </p>
                        <p className="text-white/70 text-sm leading-relaxed">
                          During the consultation, we&apos;ll discuss your
                          specific requirements, answer questions, and help you
                          determine the best solution for your needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Calendly Widget */}
                <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-12 overflow-hidden">
                  <div className="w-full max-w-2xl mx-auto flex flex-col h-full gap-4">
                    {/* Calendly Widget Container */}
                    <div style={{ minHeight: "700px" }}>
                      <div
                        key={isExpanded ? "open" : "closed"}
                        className="calendly-inline-widget"
                        data-url={calendlyUrl}
                        style={{ minWidth: "320px", height: "700px" }}
                        ref={widgetRef}
                      />
                      <Script
                        src="https://assets.calendly.com/assets/external/widget.js"
                        strategy="afterInteractive"
                        onLoad={() => {
                          setScriptLoaded(true);
                        }}
                      />
                    </div>

                    {/* Bottom Message */}
                    <div className="space-y-3 shrink-0">
                      {consultationScheduled && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg"
                        >
                          <CheckCircle className="size-4" />
                          <span>Consultation scheduled successfully!</span>
                        </motion.div>
                      )}

                      {/* <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 text-center">
                        <p className="text-white/70 text-xs leading-relaxed">
                          Sales will be finalized after the meeting. Our team
                          will contact you following the consultation to
                          complete your purchase.
                        </p>
                      </div> */}

                      <button
                        onClick={handleClose}
                        className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        {consultationScheduled ? "Close" : "Cancel"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-white via-transparent z-0" />
    </>
  );
};

export default Hero;
