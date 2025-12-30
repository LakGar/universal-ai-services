import React from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/ui/stacked-circular-footer";
import { Feature } from "@/components/ui/feature-section-with-grid";
import { About } from "@/components/landing/about";
import { CapabilityGrid } from "@/components/landing/capability-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrustSection } from "@/components/landing/trust-section";
import { FramerCarousel } from "@/components/ui/framer-carousel";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <Hero />
      <FramerCarousel />
      <CapabilityGrid />
      <HowItWorks />
      <TrustSection />
      <About />
      <Feature />
      <Footer />
    </div>
  );
};

export default page;
