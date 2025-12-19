"use client";

import * as React from "react";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function ConsultationPage() {
  const { items } = useCart();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [selectedTime, setSelectedTime] = React.useState<string>("");

  const consultationItems = items.filter((item) => item.id <= 3);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      router.push("/checkout");
    }
  };

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const dates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Consultation Required
          </h1>
          <p className="text-muted-foreground">
            Some items in your cart require a consultation before purchase. Please
            schedule a consultation appointment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Items Requiring Consultation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Items Requiring Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {consultationItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 shrink-0">
                    <AspectRatio ratio={1} className="bg-muted rounded-lg overflow-hidden">
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
                    <p className="text-sm text-muted-foreground">{item.price}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Schedule Consultation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                Schedule Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dates.map((date) => {
                    const dateStr = date.toISOString().split("T")[0];
                    return (
                      <Button
                        key={dateStr}
                        variant={selectedDate === dateStr ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedDate(dateStr)}
                      >
                        {formatDate(date)}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Clock className="size-4" />
                  Select Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedDate && selectedTime && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg">
                  <CheckCircle className="size-4" />
                  <span>
                    Consultation scheduled for {formatDate(new Date(selectedDate))} at{" "}
                    {selectedTime}
                  </span>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleContinue}
                disabled={!selectedDate || !selectedTime}
              >
                Continue to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/services/buy")}
              >
                Back to Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

