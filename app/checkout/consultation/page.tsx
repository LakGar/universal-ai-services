"use client";

import * as React from "react";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, CheckCircle } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  separateItemsByConsultationRequirement,
  requiresConsultation,
} from "@/lib/consultation-utils";

export default function ConsultationPage() {
  const { items } = useCart();
  const router = useRouter();
  const [consultationScheduled, setConsultationScheduled] =
    React.useState(false);

  // Get items that require consultation
  const { requiresConsultation: consultationItems, directCheckout } =
    React.useMemo(() => separateItemsByConsultationRequirement(items), [items]);

  React.useEffect(() => {
    if (items.length === 0) {
      router.push("/services/buy");
      return;
    }

    // Check if consultation was already scheduled (user might be coming back)
    const alreadyScheduled =
      sessionStorage.getItem("consultationScheduled") === "true";
    if (alreadyScheduled) {
      setConsultationScheduled(true);
    }

    // If no items need consultation, go to checkout
    if (consultationItems.length === 0) {
      router.push("/checkout");
    }
  }, [items.length, consultationItems.length, router]);

  const handleContinue = () => {
    if (consultationScheduled) {
      // Mark consultation as scheduled in sessionStorage so checkout knows to proceed
      sessionStorage.setItem("consultationScheduled", "true");
      // If there are items that don't need consultation, go to checkout
      // Otherwise, they'll need to complete the purchase after consultation
      if (directCheckout.length > 0) {
        router.push("/checkout");
      } else {
        // For items that need consultation, show message about completing purchase after consultation
        router.push("/checkout");
      }
    }
  };

  // Calendly embed URL
  const calendlyUrl = "https://calendly.com/lakgarg2002/advisory-meeting-1";
  const widgetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Wait for ref to be available
    if (!widgetRef.current) return;

    // Load Calendly widget script
    const loadCalendly = () => {
      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );

      const initWidget = () => {
        if (widgetRef.current && (window as any).Calendly?.initInlineWidget) {
          try {
            (window as any).Calendly.initInlineWidget({
              url: calendlyUrl,
              parentElement: widgetRef.current,
            });
          } catch (error) {
            console.error("Error initializing Calendly widget:", error);
          }
        }
      };

      if (existingScript && (window as any).Calendly) {
        // Calendly is already loaded, initialize widget
        initWidget();
        return;
      }

      if (!existingScript) {
        // Load the script
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => {
          // Wait a bit for Calendly to fully initialize
          setTimeout(() => {
            initWidget();
          }, 100);
        };
        script.onerror = () => {
          console.error("Failed to load Calendly script");
        };
        document.body.appendChild(script);
      } else {
        // Script exists but might not be loaded yet, wait for it
        const checkCalendly = setInterval(() => {
          if ((window as any).Calendly?.initInlineWidget) {
            initWidget();
            clearInterval(checkCalendly);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkCalendly);
          if (!(window as any).Calendly) {
            console.error("Calendly script failed to load");
          }
        }, 10000);
      }
    };

    loadCalendly();

    // Listen for Calendly event when consultation is scheduled
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data?.event && e.data.event.indexOf("calendly") === 0) {
        if (e.data.event === "calendly.event_scheduled") {
          setConsultationScheduled(true);
        }
      }
    };

    window.addEventListener("message", handleCalendlyEvent);

    return () => {
      window.removeEventListener("message", handleCalendlyEvent);
    };
  }, [calendlyUrl]);

  return (
    <div className="min-h-screen bg-background py-8 md:py-12 px-4 md:px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Consultation Required
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
            Some items in your cart require a consultation before purchase.
            Please schedule a consultation appointment.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Items Requiring Consultation */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="size-5" />
                Items Requiring Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {consultationItems.length > 0 ? (
                consultationItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="w-20 shrink-0">
                      <AspectRatio
                        ratio={1}
                        className="bg-muted rounded-lg overflow-hidden"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.price}
                      </p>
                      {item.addOns && item.addOns.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Includes {item.addOns.length} add-on
                          {item.addOns.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No items requiring consultation.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Schedule Consultation */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="size-5" />
                Schedule Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col p-0 max-h-[900px]">
              {/* Calendly Inline Widget */}
              <div className="flex-1 w-full overflow-hidden px-6 pb-0">
                <div
                  ref={widgetRef}
                  className="w-full h-full"
                  style={{ minHeight: "1200px", height: "100%" }}
                />
              </div>

              <div className="px-6 pb-6 pt-3 space-y-3 border-t">
                {consultationScheduled && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg">
                    <CheckCircle className="size-4" />
                    <span>Consultation scheduled successfully!</span>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleContinue}
                  disabled={!consultationScheduled}
                >
                  {directCheckout.length > 0
                    ? "Continue to Checkout"
                    : "Proceed to Complete Purchase"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/services/buy")}
                >
                  Back to Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
