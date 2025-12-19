"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
          <motion.div
            key={robot.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-shrink-0"
          >
            <div className="group relative aspect-square w-[200px] overflow-hidden rounded-2xl bg-slate-800/20 backdrop-blur-md cursor-pointer">
              {/* Robot Image */}
              <div className="absolute inset-0">
                <img
                  src={robot.image}
                  alt={robot.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content overlay - appears on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-sm font-semibold text-white mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {robot.name}
                </h3>
                <button
                  onClick={() => {
                    if (robot.url) {
                      window.location.href = robot.url;
                    }
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-transparent text-white rounded-full text-xs font-medium hover:text-blue-500 transition-colors whitespace-nowrap"
                >
                  Learn more
                  <ArrowRight className="w-2 h-2" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
