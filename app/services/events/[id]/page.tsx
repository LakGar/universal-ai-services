"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
  ExternalLink,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [imageLoading, setImageLoading] = React.useState(true);

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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-20 min-w-0">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold mb-2">Event not found</h1>
            <p className="text-muted-foreground mb-4">
              The event you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push("/services/events")}>
              Back to Events
            </Button>
          </div>
        </div>
      </>
    );
  }

  const images = event.images || [];
  const currentImage = images[currentImageIndex]
    ? getImageUrl(images[currentImageIndex])
    : "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80";

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
        {/* Hero Section with Image */}
        {images.length > 0 && (
          <div className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] overflow-hidden">
            <div className="absolute inset-0">
              {imageLoading && <Skeleton className="absolute inset-0" />}
              <Image
                src={currentImage}
                alt={event.title}
                fill
                className="object-cover"
                onLoad={() => setImageLoading(false)}
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-transparent" />
            </div>

            {/* Navigation for images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-md hover:bg-background border border-border text-foreground flex items-center justify-center transition-all shadow-lg hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-md hover:bg-background border border-border text-foreground flex items-center justify-center transition-all shadow-lg hover:scale-110 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-primary w-8"
                          : "bg-muted-foreground/50 w-2 hover:bg-muted-foreground/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant={
                      event.status === "upcoming" ? "default" : "secondary"
                    }
                    className="text-sm px-3 py-1"
                  >
                    {event.status === "upcoming" ? "Upcoming" : "Past"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-background/90 backdrop-blur-sm text-sm px-3 py-1"
                  >
                    {event.category}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground drop-shadow-lg">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/services/events")}
            className="w-fit"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Details - Only show if no hero image */}
              {images.length === 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          event.status === "upcoming" ? "default" : "secondary"
                        }
                      >
                        {event.status === "upcoming" ? "Upcoming" : "Past"}
                      </Badge>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                    <CardTitle className="text-3xl mb-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {event.longDescription || event.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Description Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {event.longDescription || event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Event Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Event Information</CardTitle>
                </CardHeader>
                <CardContent>
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
                        <p className="text-muted-foreground">
                          {event.location}
                        </p>
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
                          <p className="font-semibold text-base mb-1">
                            Capacity
                          </p>
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
                </CardContent>
              </Card>

              {/* Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Agenda</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                            {item.speaker && (
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
                  </CardContent>
                </Card>
              )}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Speakers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {event.speakers.map((speaker, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20">
                            <Image
                              src={
                                speaker.image ||
                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                              }
                              alt={speaker.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-base mb-1">
                              {speaker.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {speaker.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Highlights (for past events) */}
              {event.highlights && event.highlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Event Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
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
            <div className="space-y-6">
              {/* Registration/CTA Card */}
              {event.status === "upcoming" && event.registrationUrl && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader>
                    <CardTitle className="text-xl">Register Now</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      <div className="pt-2 border-t">
                        <p className="text-sm font-semibold text-center text-foreground">
                          {event.price}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
