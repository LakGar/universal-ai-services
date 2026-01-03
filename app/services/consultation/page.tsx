"use client";

import * as React from "react";
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
import { ConsultationModal } from "@/components/consultation-modal";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Globe2 } from "lucide-react";

export default function ConsultationPage() {
  const { state, isMobile } = useSidebar();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
                <BreadcrumbPage>Consultation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <WishlistIcon />
          <CartIcon />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 lg:p-12 pt-24 min-w-0">
        <div className="w-full min-w-0 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="my-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Expert Consultation
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
              Get expert advice on AI and robotics solutions for your business.
              Schedule a personalized consultation with our team.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Side - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Why Schedule a Consultation?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our expert team helps you navigate the complex world of
                  robotics and AI. Whether you're exploring new technologies or
                  scaling existing solutions, we provide personalized guidance
                  tailored to your needs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Production-Ready Solutions
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Deploy and scale robotics and AI systems with expert
                      integration support.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Expert Integration
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Get the support you need when deploying complex AI and
                      robotics solutions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Personalized Guidance
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Discuss your specific requirements and get tailored
                      recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Calendar className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        Ready to Get Started?
                      </h3>
                      <p className="text-muted-foreground">
                        Schedule a consultation with our team to discuss your
                        needs.
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      size="lg"
                      className="w-full"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Consultation
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Free consultation • No commitment required
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Calendly Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
