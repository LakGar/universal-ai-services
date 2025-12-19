import React from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/ui/stacked-circular-footer";
import { Feature } from "@/components/ui/feature-section-with-grid";
import { About } from "@/components/landing/about";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <Hero />
      <About />
      <Feature />
      <Footer />
    </div>
  );
};

export default page;
