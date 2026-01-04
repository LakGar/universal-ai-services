"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
  ExternalLink,
} from "lucide-react";
import eventsData from "../data/events_data.json";

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

// Format time
const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Get initials from name
const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function EventDetailPage() {
  const { state, isMobile } = useSidebar();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const event = eventsData.find((e) => e.id === eventId);
  const eventIndex = eventsData.findIndex((e) => e.id === eventId);
  const nextEvent =
    eventIndex >= 0 && eventIndex < eventsData.length - 1
      ? eventsData[eventIndex + 1]
      : null;
  const prevEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;

  // Calculate header left position based on sidebar state
  const getHeaderLeft = () => {
    if (isMobile) return "0";
    // When collapsed in icon mode with floating variant, sidebar is ~4rem (3rem icon + 1rem padding)
    // When expanded, sidebar is 19rem wide (from layout)
    return state === "collapsed" ? "4rem" : "19rem";
  };

  if (!event) {
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
                  <BreadcrumbLink href="/services/events">
                    Events
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Not Found</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <WishlistIcon />
            <CartIcon />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-20 min-w-0 mt-10">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold mb-2">Event not found</h1>
            <p className="text-muted-foreground mb-4">
              The event you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push("/services/events")}>
              Back to Events
            </Button>
          </div>
        </div>
      </>
    );
  }

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
                <BreadcrumbLink href="/services/events">Events</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-[200px]">
                  {event.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <WishlistIcon />
          <CartIcon />
        </div>
      </header>
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full mt-10">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/services/events")}
            className="w-fit"
          >
            <ChevronLeft className="w-4 h-4 mr-2 " />
            Back to Events
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      event.status === "upcoming" ? "default" : "secondary"
                    }
                  >
                    {event.status === "upcoming" ? "Upcoming" : "Past"}
                  </Badge>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {event.title}
                </h1>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {event.longDescription || event.description}
                </p>
              </div>

              {/* Event Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Event Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-base mb-1">Date</p>
                      <p className="text-muted-foreground">
                        {event.endDate
                          ? formatDateRange(event.date, event.endDate)
                          : formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-base mb-1">Location</p>
                      <p className="text-muted-foreground">{event.location}</p>
                      {event.venue && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.venue}
                        </p>
                      )}
                    </div>
                  </div>
                  {event.capacity && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-base mb-1">Capacity</p>
                        <p className="text-muted-foreground">
                          {event.capacity} attendees
                        </p>
                      </div>
                    </div>
                  )}
                  {event.price && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-2xl font-bold text-primary">
                          $
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-base mb-1">Price</p>
                        <p className="text-muted-foreground">{event.price}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="pt-6 mt-6 border-t">
                    <p className="font-semibold text-base mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-sm px-3 py-1"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Agenda</h2>
                  <div className="space-y-6">
                    {event.agenda.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-6 pb-6 border-b last:border-0 last:pb-0"
                      >
                        <div className="shrink-0 w-24">
                          <div className="text-lg font-bold text-primary">
                            {formatTime(item.time)}
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="font-semibold text-base">
                            {item.title}
                          </p>
                          {"speaker" in item && item.speaker && (
                            <p className="text-sm text-muted-foreground">
                              Speaker:{" "}
                              <span className="font-medium">
                                {item.speaker}
                              </span>
                            </p>
                          )}
                          {item.type && (
                            <Badge variant="outline" className="mt-2">
                              {item.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hosts */}
              {event.hosts && event.hosts.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Hosts</h2>
                  <div className="flex -space-x-3">
                    {event.hosts.map((host, index) => {
                      const hasImage = host.image && host.image.trim() !== "";
                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div
                              className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-background ring-2 ring-border hover:ring-primary/50 transition-all hover:scale-110 hover:z-10 cursor-pointer"
                              style={{ zIndex: event.hosts.length - index }}
                            >
                              {hasImage ? (
                                <Image
                                  src={host.image}
                                  alt={host.name || "Host"}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full bg-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-xs">
                                  {getInitials(host.name || "Host")}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{host.name || "Host"}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Speakers</h2>
                  <div className="flex -space-x-3">
                    {event.speakers.map((speaker, index) => {
                      const hasImage =
                        speaker.image && speaker.image.trim() !== "";
                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div
                              className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-background ring-2 ring-border hover:ring-primary/50 transition-all hover:scale-110 hover:z-10 cursor-pointer"
                              style={{ zIndex: event.speakers.length - index }}
                            >
                              {hasImage ? (
                                <Image
                                  src={speaker.image}
                                  alt={speaker.name || "Speaker"}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full bg-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-xs">
                                  {getInitials(speaker.name || "Speaker")}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{speaker.name || "Speaker"}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Highlights (for past events) */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Event Highlights</h2>
                  <ul className="space-y-4">
                    {event.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-base leading-relaxed">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between gap-4 pt-4">
                {prevEvent ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/services/events/${prevEvent.id}`)
                    }
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Event
                  </Button>
                ) : (
                  <div className="flex-1" />
                )}
                {nextEvent && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/services/events/${nextEvent.id}`)
                    }
                    className="flex-1"
                  >
                    Next Event
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Registration/CTA */}
              {event.status === "upcoming" && event.registrationUrl && (
                <div className="space-y-4 p-6 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <h3 className="text-xl font-semibold">Register Now</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Secure your spot at this event. Limited availability.
                  </p>
                  <Button asChild className="w-full" size="lg">
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Register Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  {event.price && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold text-center text-foreground">
                        {event.price}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Quick Info</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold mb-2 text-muted-foreground">
                      Category
                    </p>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {event.category}
                    </Badge>
                  </div>
                  {event.capacity && (
                    <div>
                      <p className="text-sm font-semibold mb-2 text-muted-foreground">
                        Capacity
                      </p>
                      <p className="text-base font-medium">
                        {event.capacity} attendees
                      </p>
                    </div>
                  )}
                  {event.price && (
                    <div>
                      <p className="text-sm font-semibold mb-2 text-muted-foreground">
                        Price
                      </p>
                      <p className="text-base font-medium">{event.price}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold mb-2 text-muted-foreground">
                      Status
                    </p>
                    <Badge
                      variant={
                        event.status === "upcoming" ? "default" : "secondary"
                      }
                      className="text-sm px-3 py-1"
                    >
                      {event.status === "upcoming" ? "Upcoming" : "Past"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
