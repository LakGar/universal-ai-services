"use client";

import * as React from "react";
import Script from "next/script";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, CheckCircle } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { separateItemsByConsultationRequirement } from "@/lib/consultation-utils";

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
  const calendlyUrl = "https://calendly.com/fernandolorenzo";

  // Listen for Calendly event when consultation is scheduled
  React.useEffect(() => {
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
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Consultation Required
        </h1>
        <p className="text-muted-foreground">
          Some items in your cart require a consultation before purchase. Please
          schedule an appointment below.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items Requiring Consultation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5" />
              Items Requiring Consultation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                        sizes="80px"
                        className="object-cover"
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.price}
                    </p>
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
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
              <Calendar className="size-6" />
              Schedule Consultation
            </h2>
            <p className="text-muted-foreground text-sm">
              Please schedule a consultation appointment to proceed with your
              purchase.
            </p>
          </div>

          {/* Calendly Inline Widget - Using Next.js Script component */}
          <div style={{ minHeight: "700px" }}>
            <div
              className="calendly-inline-widget"
              data-url={calendlyUrl}
              style={{ minWidth: "320px", height: "700px" }}
            />
            <Script
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="afterInteractive"
            />
          </div>

          <div className="space-y-3 pt-4 border-t">
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
        </div>
      </div>
    </div>
  );
}
