"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useState, useEffect, useMemo } from "react";
import { X, Check, BarChart3, Globe2 } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import { RobotCards, RobotCard } from "@/components/ui/robot-cards";
import { RobotCardsMobile } from "@/components/ui/robot-cards-mobile";
import buyData from "@/app/services/buy/data/buy_data.json";

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

// Transform buy data to robot cards format
const transformRobots = () => {
  // Filter to only "Buy" category items and limit to 7 for hero
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

    const imageUrl = getProductImage(item);

    // Debug: log the image URL to see what we're getting
    if (typeof window !== "undefined" && index < 5) {
      console.log(`Robot ${index + 1} (${item["Model Name"]}):`, imageUrl);
    }

    return {
      id: index + 1,
      name: item["Model Name"] || "Robot",
      image: imageUrl,
      url: `/services/buy/${detailPageId}`,
    };
  });
};

export const Hero = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formStep, setFormStep] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  // Transform buy data to robots
  const robots = useMemo(() => transformRobots(), []);

  const handleExpand = () => setIsExpanded(true);

  const handleClose = () => {
    setIsExpanded(false);
    // Reset form after a brief delay so the user doesn't see it reset while closing
    setTimeout(() => setFormStep("idle"), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStep("submitting");
    // Simulate API call
    setTimeout(() => {
      setFormStep("success");
    }, 1500);
  };

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
            Marketplace for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Intelligent
            </span>{" "}
            Robotics & AI Systems
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
              href="/signup"
            >
              Sign up
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

                  <div className="mt-auto pt-8 border-t border-white/20">
                    <figure>
                      <blockquote className="text-xl font-medium leading-relaxed mb-6">
                        "Universal AI Services helped us deploy intelligent
                        robotics solutions that transformed our manufacturing
                        process. The expert integration support made all the
                        difference."
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
                  </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-16 bg-black/10 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
                  <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                    {formStep === "success" ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center h-[400px] space-y-6"
                      >
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                          <Check className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            Request Received!
                          </h3>
                          <p className="text-white/80">
                            Our team will be in touch shortly to schedule your
                            personalized consultation.
                          </p>
                        </div>
                        <button
                          onClick={handleClose}
                          className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Return to Homepage
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold text-white">
                            Get a Consultation
                          </h3>
                          <p className="text-sm text-white/70">
                            Fill out the form below and we'll contact you.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider"
                            >
                              Full Name
                            </label>
                            <input
                              required
                              type="text"
                              id="name"
                              placeholder="Jane Doe"
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider"
                            >
                              Work Email
                            </label>
                            <input
                              required
                              type="email"
                              id="email"
                              placeholder="jane@company.com"
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="company"
                                className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider"
                              >
                                Company
                              </label>
                              <input
                                type="text"
                                id="company"
                                placeholder="Acme Inc"
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="size"
                                className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider"
                              >
                                Size
                              </label>
                              <select
                                id="size"
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
                              >
                                <option className="bg-gray-900">1-50</option>
                                <option className="bg-gray-900">51-200</option>
                                <option className="bg-gray-900">
                                  201-1000
                                </option>
                                <option className="bg-gray-900">1000+</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="message"
                              className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider"
                            >
                              Needs
                            </label>
                            <textarea
                              id="message"
                              rows={3}
                              placeholder="Tell us about your project..."
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all resize-none text-sm"
                            />
                          </div>
                        </div>

                        <button
                          disabled={formStep === "submitting"}
                          type="submit"
                          className="w-full flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90 focus:ring-4 focus:ring-white/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                          {formStep === "submitting" ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                              Sending...
                            </span>
                          ) : (
                            "Submit Request"
                          )}
                        </button>

                        <p className="text-xs text-center text-white/50 mt-4">
                          By submitting, you agree to our Terms of Service and
                          Privacy Policy.
                        </p>
                      </form>
                    )}
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
