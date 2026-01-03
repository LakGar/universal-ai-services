"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
import { CartIcon } from "@/components/cart-icon";
import { WishlistIcon } from "@/components/wishlist-icon";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";
import mediaData from "./data/media_data.json";

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  category: string;
  width: number;
  height: number;
}

// Calculate height based on aspect ratio for masonry layout
const getMasonryHeight = (width: number, height: number): number => {
  const aspectRatio = height / width;
  // Base column width (will be adjusted by CSS columns)
  const baseWidth = 300;
  const calculatedHeight = baseWidth * aspectRatio;
  // Add some natural variation for masonry effect
  const variation = (Math.random() - 0.3) * 100;
  return Math.max(250, Math.min(650, calculatedHeight + variation));
};

export default function MediaPage() {
  const { state, isMobile } = useSidebar();
  const [selectedMedia, setSelectedMedia] = React.useState<MediaItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Calculate header left position based on sidebar state
  const getHeaderLeft = () => {
    if (isMobile) return "0";
    // When collapsed in icon mode with floating variant, sidebar is ~4rem (3rem icon + 1rem padding)
    // When expanded, sidebar is 19rem wide (from layout)
    return state === "collapsed" ? "4rem" : "19rem";
  };

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMedia(null), 300);
  };

  return (
    <>
      <header
        className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-[left] duration-200 ease-linear"
        style={{
          left: getHeaderLeft(),
          right: 0,
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
                <BreadcrumbPage>Media</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <WishlistIcon />
          <CartIcon />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 lg:p-12 pt-24 min-w-0">
        <div className="w-full min-w-0 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="my-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">
              Media Gallery
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our latest videos, images, and resources from the world of
              robotics and AI.
            </p>
          </motion.div>

          {/* Masonry Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
          >
            {mediaData.map((item, index) => {
              const height = getMasonryHeight(item.width, item.height);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative mb-4 break-inside-avoid cursor-pointer rounded-lg overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
                  onClick={() => handleMediaClick(item as MediaItem)}
                >
                  {/* Media Container */}
                  <div
                    className="relative w-full"
                    style={{ height: `${height}px` }}
                  >
                    {item.type === "video" ? (
                      <>
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Play
                              className="w-8 h-8 text-primary ml-1"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Modal for Full View */}
      <AnimatePresence>
        {isModalOpen && selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full max-h-[90vh] bg-background rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Media Content */}
              <div className="relative w-full h-[90vh]">
                {selectedMedia.type === "video" ? (
                  <video
                    src={selectedMedia.url}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <Image
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
