"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight, Sparkles } from "lucide-react";
import eventsData from "./data/events_data.json";

// Helper function to extract file ID from Google Drive URL
const extractFileId = (url: string): string | null => {
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
};

// Helper function to convert Google Drive link to direct URL
const getImageUrl = (url: string): string => {
  if (url.startsWith("http") && !url.includes("drive.google.com")) {
    return url;
  }
  const fileId = extractFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return url;
};

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date range
const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (startDate === endDate) {
    return formatDate(startDate);
  }

  const startMonth = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endMonth = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startMonth} - ${endMonth}`;
};

interface EventCardProps {
  event: (typeof eventsData)[0];
  featured?: boolean;
}

function EventCard({ event, featured = false }: EventCardProps) {
  const imageUrl =
    event.images && event.images.length > 0
      ? getImageUrl(event.images[0])
      : "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";

  const isUpcoming = event.status === "upcoming";

  if (featured) {
    return (
      <Link href={`/services/events/${event.id}`}>
        <motion.div
          whileHover={{ y: -8, scale: 1.01 }}
          className="group relative h-full min-h-[500px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 group-hover:from-black/95 group-hover:via-black/70 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-8 text-white">
            <div className="mb-4">
              <Badge
                variant={isUpcoming ? "default" : "secondary"}
                className="mb-3 text-sm px-3 py-1"
              >
                {isUpcoming ? (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Upcoming
                  </>
                ) : (
                  "Past Event"
                )}
              </Badge>
              <Badge variant="outline" className="text-white border-white/30">
                {event.category}
              </Badge>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold mb-3 line-clamp-2 text-white group-hover:text-white/90 transition-colors">
              {event.title}
            </h3>

            <p className="text-white/90 text-lg mb-6 line-clamp-3">
              {event.description}
            </p>

            <div className="space-y-3 mb-6 text-white/80">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 shrink-0" />
                <span className="text-base">
                  {event.endDate
                    ? formatDateRange(event.date, event.endDate)
                    : formatDate(event.date)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 shrink-0" />
                <span className="text-base line-clamp-1">{event.location}</span>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 shrink-0" />
                  <span className="text-base">{event.capacity} attendees</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
              <span className="font-medium">Learn More</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/services/events/${event.id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative h-full rounded-2xl overflow-hidden cursor-pointer bg-card border border-border shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
      >
        {/* Image */}
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-500" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge
              variant={isUpcoming ? "default" : "secondary"}
              className="shadow-lg backdrop-blur-sm bg-background/90 border-0 text-black"
            >
              {isUpcoming ? (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Upcoming
                </>
              ) : (
                "Past"
              )}
            </Badge>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge
              variant="outline"
              className="bg-background/95 backdrop-blur-md border-white/40 text-foreground shadow-lg"
            >
              {event.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 bg-card">
          <div>
            <h3 className="font-bold text-xl mb-2 line-clamp-2 text-foreground">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/70 transition-colors">
              <Calendar className="w-4 h-4 shrink-0 text-primary/70" />
              <span className="line-clamp-1">
                {event.endDate
                  ? formatDateRange(event.date, event.endDate)
                  : formatDate(event.date)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/70 transition-colors">
              <MapPin className="w-4 h-4 shrink-0 text-primary/70" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            {event.capacity && (
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/70 transition-colors">
                <Users className="w-4 h-4 shrink-0 text-primary/70" />
                <span>{event.capacity} attendees</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-primary pt-2 group-hover:gap-4 transition-all duration-300">
            <span className="text-sm font-semibold">View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function EventsPage() {
  const { state, isMobile } = useSidebar();
  const upcomingEvents = eventsData.filter(
    (event) => event.status === "upcoming"
  );
  const pastEvents = eventsData.filter((event) => event.status === "past");
  const featuredEvent = upcomingEvents[0];
  const otherUpcomingEvents = upcomingEvents.slice(1);

  // Calculate header left position based on sidebar state
  const getHeaderLeft = () => {
    if (isMobile) return "0";
    // When collapsed in icon mode with floating variant, sidebar is ~4rem (3rem icon + 1rem padding)
    // When expanded, sidebar is 19rem wide (from layout)
    return state === "collapsed" ? "4rem" : "19rem";
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
                <BreadcrumbPage>Events</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <WishlistIcon />
          <CartIcon />
        </div>
      </header>
      <div className="flex flex-1 flex-col min-w-0 pt-10">
        {/* Hero Section */}
        {/* <div className="relative w-full h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="relative h-full flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Events & Conferences
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Join industry leaders, explore innovations, and connect with the robotics community
              </p>
            </motion.div>
          </div>
        </div> */}

        <div className="flex flex-1 flex-col gap-8 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Upcoming Events
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Don't miss out on these exciting opportunities
                  </p>
                </div>
              </div>

              {/* Featured Event */}
              {featuredEvent && (
                <div className="mb-8">
                  <EventCard event={featuredEvent} featured />
                </div>
              )}

              {/* Other Upcoming Events */}
              {otherUpcomingEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherUpcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 pt-8 border-t"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Past Events
                </h2>
                <p className="text-muted-foreground text-lg">
                  Relive our previous conferences and showcases
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </motion.div>
          )}

          {upcomingEvents.length === 0 && pastEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                <Calendar className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                No events available
              </h3>
              <p className="text-muted-foreground">
                Check back soon for upcoming events and conferences.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
