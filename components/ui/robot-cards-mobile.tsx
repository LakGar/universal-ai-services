"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                {robot.image.includes("drive.google.com") ? (
                  <img
                    src={robot.image}
                    alt={robot.name}
                    className={cn(
                      "h-full w-full object-cover transition-opacity duration-300",
                      imageLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true);
                      setImageLoading(false);
                    }}
                  />
                ) : (
                  <Image
                    src={robot.image}
                    alt={robot.name}
                    fill
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
              </div>
            )}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                <p className="text-sm">Image not available</p>
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
