"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CartIcon } from "@/components/cart-icon";
import { WishlistIcon } from "@/components/wishlist-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Play, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { cn } from "@/lib/utils";

// Mock product data - in real app, fetch from API
const products = [
  {
    id: 1,
    name: "Industrial Robot Arm Pro",
    description:
      "The Industrial Robot Arm Pro is a state-of-the-art robotic solution designed for precision manufacturing and automation. With advanced AI capabilities and 6-axis movement, it delivers unmatched accuracy and efficiency in industrial applications.",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    price: 45999,
    monthlyPrice: 1916.62,
    monthlyMonths: 24,
    isNew: true,
    options: {
      configurations: [
        { id: "standard", name: "Standard Configuration", price: 0 },
        { id: "premium", name: "Premium Configuration", price: 5000 },
        { id: "enterprise", name: "Enterprise Configuration", price: 10000 },
      ],
      colors: [
        { id: "blue", name: "Blue", value: "#3b82f6" },
        { id: "red", name: "Red", value: "#ef4444" },
        { id: "green", name: "Green", value: "#10b981" },
        { id: "orange", name: "Orange", value: "#f59e0b" },
      ],
    },
    addOns: [
      {
        id: "warranty",
        name: "Extended Warranty (3 years)",
        price: 2999,
        description: "Comprehensive coverage for 3 years",
      },
      {
        id: "installation",
        name: "Professional Installation",
        price: 1999,
        description: "Expert setup and configuration",
      },
      {
        id: "training",
        name: "Training & Support Package",
        price: 1499,
        description: "On-site training included",
      },
    ],
    specs: {
      weight: "45 kg",
      dimensions: "1200mm × 800mm × 600mm",
      payload: "20 kg",
      reach: "1500 mm",
      repeatability: "±0.02 mm",
      power: "3.5 kW",
      controller: "Advanced AI Controller",
      programming: "Visual Programming Interface",
      connectivity: "Wi-Fi, Ethernet, USB",
      safety: "ISO 10218-1 Certified",
    },
    features: [
      "6-axis precision movement",
      "AI-powered path optimization",
      "Collision detection and avoidance",
      "Real-time monitoring and analytics",
      "Easy integration with existing systems",
      "Cloud-based management platform",
    ],
  },
  {
    id: 2,
    name: "Autonomous Delivery Bot",
    description:
      "Revolutionary autonomous delivery robot designed for last-mile logistics. Features advanced navigation, obstacle avoidance, and secure cargo handling.",
    images: [
      "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=1200&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    ],
    video: null,
    price: 29999,
    monthlyPrice: 1249.96,
    monthlyMonths: 24,
    isNew: true,
    options: {
      configurations: [
        { id: "standard", name: "Standard", price: 0 },
        { id: "premium", name: "Premium", price: 3000 },
      ],
      colors: [
        { id: "white", name: "White", value: "#ffffff" },
        { id: "black", name: "Black", value: "#000000" },
      ],
    },
    addOns: [
      { id: "warranty", name: "Extended Warranty", price: 1999, description: "Comprehensive coverage for 3 years" },
      { id: "installation", name: "Installation", price: 999, description: "Expert setup and configuration" },
    ],
    specs: {
      weight: "25 kg",
      dimensions: "600mm × 500mm × 800mm",
      payload: "30 kg",
      speed: "5 km/h",
      battery: "8 hours",
      navigation: "LiDAR + Camera",
    },
    features: [
      "Autonomous navigation",
      "Weather resistant",
      "Secure cargo compartment",
      "Real-time tracking",
    ],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const productId = parseInt(params.id as string);
  const product = products.find((p) => p.id === productId);

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [selectedConfig, setSelectedConfig] = React.useState(product?.options.configurations[0].id || "");
  const [selectedColor, setSelectedColor] = React.useState(product?.options.colors[0].id || "");
  const [selectedAddOns, setSelectedAddOns] = React.useState<Set<string>>(new Set());
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push("/services/buy")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const selectedConfigData = product.options.configurations.find((c) => c.id === selectedConfig);
  const selectedColorData = product.options.colors.find((c) => c.id === selectedColor);
  const basePrice = product.price + (selectedConfigData?.price || 0);
  const addOnsTotal = Array.from(selectedAddOns).reduce((sum, addOnId) => {
    const addOn = product.addOns.find((a) => a.id === addOnId);
    return sum + (addOn?.price || 0);
  }, 0);
  const totalPrice = basePrice + addOnsTotal;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: `$${totalPrice.toLocaleString()}`,
    });
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: `$${totalPrice.toLocaleString()}`,
      });
    }
  };

  const handleToggleAddOn = (addOnId: string) => {
    const newSet = new Set(selectedAddOns);
    if (newSet.has(addOnId)) {
      newSet.delete(addOnId);
    } else {
      newSet.add(addOnId);
    }
    setSelectedAddOns(newSet);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      <header className="fixed top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b w-[calc(100%-var(--sidebar-width))] md:w-[calc(100%-var(--sidebar-width)-1rem)]">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/services">Services</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/services/buy">Buy</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
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
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Side - Images/Videos */}
            <div className="space-y-4">
              {/* Main Image/Video */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                {isVideoPlaying && product.video ? (
                  <video
                    src={product.video}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onEnded={() => setIsVideoPlaying(false)}
                  />
                ) : (
                  <>
                    <Image
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.video && (
                      <button
                        onClick={() => setIsVideoPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                      >
                        <div className="bg-white/90 rounded-full p-4">
                          <Play className="size-12 text-black ml-1" fill="currentColor" />
                        </div>
                      </button>
                    )}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronLeft className="size-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronRight className="size-6" />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setIsVideoPlaying(false);
                      }}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                        selectedImageIndex === index
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/50"
                      )}
                    >
                      <Image src={image} alt={`${product.name} view ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Options, Details, Add-ons */}
            <div className="space-y-6">
              {/* Name and Badge */}
              <div>
                {product.isNew && (
                  <Badge className="mb-2 bg-blue-600 text-white">NEW</Badge>
                )}
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Price */}
              <div className="border-t pt-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">${basePrice.toLocaleString()}</span>
                  {selectedConfigData && selectedConfigData.price > 0 && (
                    <span className="text-sm text-muted-foreground">
                      + ${selectedConfigData.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">
                  or ${product.monthlyPrice.toLocaleString()}/mo. for {product.monthlyMonths} mo.*
                </p>
              </div>

              {/* Configuration Options */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Configuration</h3>
                <div className="space-y-2">
                  {product.options.configurations.map((config) => (
                    <button
                      key={config.id}
                      onClick={() => setSelectedConfig(config.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border-2 transition-colors",
                        selectedConfig === config.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{config.name}</span>
                        {config.price > 0 && (
                          <span className="text-sm text-muted-foreground">+ ${config.price.toLocaleString()}</span>
                        )}
                        {selectedConfig === config.id && <Check className="size-5 text-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Options */}
              {product.options.colors.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Color</h3>
                  <div className="flex gap-3">
                    {product.options.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={cn(
                          "size-12 rounded-full border-2 transition-all",
                          selectedColor === color.id
                            ? "border-primary scale-110"
                            : "border-muted hover:border-muted-foreground/50"
                        )}
                        style={{ backgroundColor: color.value }}
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedColorData?.name}
                  </p>
                </div>
              )}

              {/* Add-ons */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Add-ons</h3>
                <div className="space-y-3">
                  {product.addOns.map((addOn) => (
                    <label
                      key={addOn.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors",
                        selectedAddOns.has(addOn.id)
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAddOns.has(addOn.id)}
                        onChange={() => handleToggleAddOn(addOn.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{addOn.name}</span>
                          <span className="text-sm font-semibold">${addOn.price.toLocaleString()}</span>
                        </div>
                        {addOn.description && (
                          <p className="text-sm text-muted-foreground mt-1">{addOn.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Total Price */}
              {selectedAddOns.size > 0 && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-6 space-y-3">
                <Button onClick={handleAddToCart} size="lg" className="w-full">
                  Add to Cart
                </Button>
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Heart
                    className={cn(
                      "mr-2 size-5",
                      isInWishlist(product.id) && "fill-red-500 text-red-500"
                    )}
                  />
                  {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Specs and Technical Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <dt className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</dt>
                      <dd className="text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="size-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

