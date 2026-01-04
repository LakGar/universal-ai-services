"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { logger } from "@/lib/logger";

export const items = [
  {
    id: 1,
    url: "/carousel/video7.mp4",
  },
  {
    id: 2,
    url: "/carousel/video6.mp4",
  },
  {
    id: 3,
    url: "/carousel/video3.mp4",
  },
  {
    id: 4,
    url: "/carousel/video1.mp4",
  },
  {
    id: 5,
    url: "/carousel/video2.mp4",
  },
  {
    id: 6,
    url: "/carousel/video5.mp4",
  },
];

export function FramerCarousel() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x]);

  // Handle video end and auto-advance
  useEffect(() => {
    const currentVideo = videoRefs.current[index];

    if (currentVideo) {
      const handleVideoEnd = () => {
        // Move to next video when current video ends
        if (index < items.length - 1) {
          setIndex(index + 1);
        } else {
          // Loop back to first video
          setIndex(0);
        }
      };

      const handleCanPlay = () => {
        // Try to play when video is ready
        const playPromise = currentVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            logger.debug(`Autoplay prevented for video ${index + 1}`, {
              error,
            });
          });
        }
      };

      const handleError = (e: Event) => {
        logger.error(
          `Video ${index + 1} (${items[index].url}) failed to load`,
          e instanceof Error ? e : new Error(String(e)),
          { videoIndex: index + 1, url: items[index].url }
        );
        // Skip to next video if current one fails after a delay
        setTimeout(() => {
          if (index < items.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }, 2000);
      };

      currentVideo.addEventListener("ended", handleVideoEnd);
      currentVideo.addEventListener("canplay", handleCanPlay);
      currentVideo.addEventListener("error", handleError);

      // Ensure video plays if already loaded
      if (currentVideo.readyState >= 2) {
        const playPromise = currentVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            logger.debug(`Autoplay prevented for video ${index + 1}`, {
              error,
            });
          });
        }
      }

      return () => {
        currentVideo.removeEventListener("ended", handleVideoEnd);
        currentVideo.removeEventListener("canplay", handleCanPlay);
        currentVideo.removeEventListener("error", handleError);
      };
    }
  }, [index]);

  // Pause all other videos when index changes
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [index]);

  return (
    <div className="lg:p-10 sm:p-4 p-2 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3">
        <div 
          className="relative overflow-hidden rounded-lg w-full aspect-video max-h-[700px] sm:max-h-[700px]"
          ref={containerRef}
        >
          <motion.div className="flex h-full" style={{ x }}>
            {items.map((item, i) => (
              <div key={item.id} className="shrink-0 w-full h-full relative flex items-center justify-center bg-black">
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={item.url}
                  className="w-full h-full object-contain sm:object-cover rounded-lg select-none pointer-events-none"
                  draggable={false}
                  autoPlay={i === index}
                  muted
                  playsInline
                  preload={i === index ? "auto" : "metadata"}
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    logger.error(
                      `Error loading video ${i + 1} (${item.url})`,
                      target.error
                        ? new Error(target.error.message)
                        : new Error("Unknown video error"),
                      {
                        videoIndex: i + 1,
                        url: item.url,
                        code: target.error?.code,
                        message: target.error?.message,
                      }
                    );
                  }}
                />
              </div>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-10
              ${
                index === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-white/90 hover:scale-110 hover:opacity-100 opacity-70"
              }`}
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          {/* Next Button */}
          <motion.button
            disabled={index === items.length - 1}
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-10
              ${
                index === items.length - 1
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-white/90 hover:scale-110 hover:opacity-100 opacity-70"
              }`}
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
          {/* Progress Indicator */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-black/40 sm:bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  i === index ? "w-6 sm:w-8 bg-white" : "w-1.5 sm:w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
