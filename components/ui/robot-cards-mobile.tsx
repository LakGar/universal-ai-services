"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

interface RobotCardsMobileProps {
  robots: Array<{
    id: number;
    name: string;
    image: string;
    url?: string;
  }>;
  className?: string;
}

export function RobotCardsMobile({ robots, className }: RobotCardsMobileProps) {
  if (!robots || robots.length === 0) return null;

  const RobotCardMobile = ({ robot, index }: { robot: typeof robots[0]; index: number }) => {
    const [imageLoading, setImageLoading] = React.useState(true);
    const [imageError, setImageError] = React.useState(false);

    // Timeout for images that don't load
    React.useEffect(() => {
      if (imageLoading && robot.image) {
        const timeout = setTimeout(() => {
          logger.warn("Image loading timeout", { image: robot.image });
          setImageError(true);
          setImageLoading(false);
        }, 8000); // 8 second timeout

        return () => clearTimeout(timeout);
      }
      // If no image URL, show error immediately
      if (!robot.image || robot.image === "") {
        setImageError(true);
        setImageLoading(false);
      }
    }, [imageLoading, robot.image]);

    return (
      <motion.div
        key={robot.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="flex-shrink-0"
      >
        <div className="group relative aspect-square w-[200px] overflow-hidden rounded-2xl bg-slate-800/20 backdrop-blur-md cursor-pointer">
          {/* Robot Image */}
          <div className="absolute inset-0 overflow-hidden">
            {imageLoading && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            {!imageError && (
              <Image
                src={robot.image}
                alt={robot.name}
                fill
                sizes="(max-width: 768px) 150px, 180px"
                className={cn(
                  "object-cover transition-opacity duration-300",
                  imageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            )}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                <div className="text-center p-4">
                  <p className="text-sm text-white/70 font-medium">{robot.name}</p>
                  <p className="text-xs text-white/50 mt-1">Image unavailable</p>
                </div>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content overlay - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-sm font-semibold text-white mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {robot.name}
            </h3>
            {robot.url ? (
              <Link
                href={robot.url}
                className="flex items-center gap-1 px-4 py-2 bg-transparent text-white rounded-full text-xs font-medium hover:text-blue-500 transition-colors whitespace-nowrap"
              >
                Learn more
                <ArrowRight className="w-2 h-2" />
              </Link>
            ) : (
              <button className="flex items-center gap-1 px-4 py-2 bg-transparent text-white rounded-full text-xs font-medium hover:text-blue-500 transition-colors whitespace-nowrap">
                Learn more
                <ArrowRight className="w-2 h-2" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={`w-full overflow-x-auto overflow-y-hidden py-4 ${
        className || ""
      }`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
      }}
    >
      <div className="flex gap-4 px-4 min-w-max">
        {robots.map((robot, index) => (
          <RobotCardMobile key={robot.id} robot={robot} index={index} />
        ))}
      </div>
    </div>
  );
}
