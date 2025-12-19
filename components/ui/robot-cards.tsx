"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface RobotCard {
  id: number;
  name: string;
  image: string;
  url?: string;
}

interface RobotCardProps {
  robot: RobotCard;
  index: number;
  totalCards?: number;
}

export function RobotCard({
  robot,
  index,
  totalCards,
}: RobotCardProps & { totalCards: number }) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Calculate rotation and position for fan effect
  const centerIndex = Math.floor((totalCards - 1) / 1.51);
  const offset = index - centerIndex;
  const rotation = offset * 6; // Degrees of rotation
  // Adjust spacing based on number of cards for better centering
  const spacing = totalCards <= 2 ? 100 : totalCards <= 4 ? 120 : 140;
  const xOffset = offset * spacing;
  // Cards overlap as they go to the right (lower z-index for right-side cards)
  const zIndex = totalCards - offset; // Left cards have higher z-index, right cards overlap behind
  // First and last cards positioned higher to break the curve
  const yOffset = index === 0 || index === totalCards - 1 ? 50 : 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        rotate: rotation,
        x: `calc(-50% + ${xOffset}px)`,
      }}
      animate={{
        opacity: 1,
        y: isHovered ? -15 : yOffset,
        scale: isHovered ? 1.05 : 1,
        rotate: rotation, // Keep rotation static on hover
        x: `calc(-50% + ${xOffset}px)`, // Keep x position static on hover
        zIndex: isHovered ? 100 : zIndex, // Higher z-index on hover
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group absolute aspect-square w-[180px] md:w-[200px] overflow-hidden rounded-2xl bg-slate-800/20 backdrop-blur-md cursor-pointer"
      style={{
        left: "50%",
        transformOrigin: "center center",
        boxShadow: isHovered
          ? "0 25px 50px rgba(0, 0, 0, 0.5)"
          : "0 8px 16px rgba(0, 0, 0, 0.2)",
      }}
    >
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
      <motion.div
        initial={false}
        animate={{
          y: isHovered ? 0 : 20,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-2">{robot.name}</h3>
        <motion.button
          initial={false}
          animate={{
            y: isHovered ? 0 : 10,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => {
            if (robot.url) {
              window.location.href = robot.url;
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-transparent  text-white rounded-full text-xs font-medium hover:text-blue-500 transition-colors w-full text-right"
        >
          Learn more
          <ArrowRight className="w-2 h-2" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

interface RobotCardsProps {
  robots: RobotCard[];
  className?: string;
}

export function RobotCards({ robots, className }: RobotCardsProps) {
  const [visibleRobots, setVisibleRobots] = React.useState(robots);
  const [cardCount, setCardCount] = React.useState(robots.length);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const updateCardCount = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile: hide cards
        setIsMobile(true);
        setCardCount(0);
        setVisibleRobots([]);
      } else if (width < 1024) {
        // Medium screens: 4 cards
        setIsMobile(false);
        setCardCount(4);
        setVisibleRobots(robots.slice(0, 4));
      } else {
        // Large screens: all cards
        setIsMobile(false);
        setCardCount(robots.length);
        setVisibleRobots(robots);
      }
    };

    updateCardCount();
    window.addEventListener("resize", updateCardCount);
    return () => window.removeEventListener("resize", updateCardCount);
  }, [robots]);

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div
      className={`relative flex items-center gap-4 justify-center h-[300px] md:h-[350px] w-full overflow-x-visible ${
        className || "py-4"
      }`}
    >
      {visibleRobots.map((robot, index) => (
        <RobotCard
          key={robot.id}
          robot={robot}
          index={index}
          totalCards={cardCount}
        />
      ))}
    </div>
  );
}
