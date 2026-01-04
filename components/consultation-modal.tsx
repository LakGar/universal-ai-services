"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { X, CheckCircle, BarChart3, Globe2, Calendar } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import { logger } from "@/lib/logger";

interface CalendlyInitOptions {
  url: string;
  parentElement: HTMLElement;
}

interface Calendly {
  initInlineWidget: (options: CalendlyInitOptions) => void;
}

declare global {
  interface Window {
    Calendly?: Calendly;
  }
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [consultationScheduled, setConsultationScheduled] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const calendlyUrl = "https://calendly.com/lakgarg2002/advisory-meeting-1";

  // Reset consultation scheduled state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setConsultationScheduled(false);
      }, 500);
    }
  }, [isOpen]);

  // Initialize Calendly widget when modal opens and script is loaded
  useEffect(() => {
    if (!isOpen || !widgetRef.current) return;

    const initWidget = () => {
      if (!widgetRef.current) return;

      // Clear any existing content
      widgetRef.current.innerHTML = "";

      // Initialize the widget if Calendly is available
      if (window.Calendly?.initInlineWidget) {
        try {
          window.Calendly.initInlineWidget({
            url: calendlyUrl,
            parentElement: widgetRef.current,
          });
        } catch (error) {
          logger.error(
            "Error initializing Calendly widget",
            error instanceof Error ? error : new Error(String(error))
          );
        }
      }
    };

    // Check if Calendly is already available
    if (window.Calendly?.initInlineWidget) {
      // Small delay to ensure DOM is ready
      setTimeout(initWidget, 100);
      return;
    }

    // If script is loaded but Calendly isn't ready yet, wait for it
    if (scriptLoaded) {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.Calendly?.initInlineWidget) {
          clearInterval(checkInterval);
          setTimeout(initWidget, 100);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          logger.error(
            "Calendly script loaded but failed to initialize",
            new Error("Calendly initialization timeout")
          );
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, [isOpen, scriptLoaded, calendlyUrl]);

  // Listen for Calendly event when consultation is scheduled
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            style={{ borderRadius: "24px" }}
            className="relative flex h-full w-full overflow-hidden bg-black dark:bg-white sm:rounded-[24px] shadow-2xl"
          >
            {/* Mesh Gradient Background inside Modal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none"
            >
              <MeshGradient
                speed={0.6}
                colors={["#000000", "#1a1a1a", "#2d2d2d", "#0a0a0a"]}
                distortion={0.8}
                swirl={0.1}
                grainMixer={0.15}
                grainOverlay={0}
                style={{ height: "100%", width: "100%" }}
              />
            </motion.div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleClose}
              className="absolute right-4 top-4 sm:right-8 sm:top-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative z-10 flex flex-col lg:flex-row h-full w-full max-w-7xl mx-auto overflow-y-auto lg:overflow-hidden"
            >
              {/* Left Side: Testimonials & Info */}
              <div className="hidden flex-1 md:flex flex-col justify-center p-8 sm:p-12 lg:p-16 gap-8 text-white">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                    Ready to scale?
                  </h2>
                  <p className="text-white/80 text-lg max-w-md">
                    Join forward-thinking companies building the future with
                    intelligent robotics and AI systems.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <BarChart3 className="w-6 h-6 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Production-Ready Solutions
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">
                        Deploy and scale robotics and AI systems with expert
                        integration support.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Globe2 className="w-6 h-6 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Expert Integration
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">
                        Get the support you need when deploying complex AI and
                        robotics solutions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/20 space-y-8">
                  <figure>
                    <blockquote className="text-xl font-medium leading-relaxed mb-6">
                      &ldquo;Universal AI Services helped us deploy intelligent
                      robotics solutions that transformed our manufacturing
                      process. The expert integration support made all the
                      difference.&rdquo;
                    </blockquote>
                    <figcaption className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-lg font-bold text-white">
                        JD
                      </div>
                      <div>
                        <div className="font-semibold">John Davis</div>
                        <div className="text-sm text-white/70">
                          CTO, TechCorp
                        </div>
                      </div>
                    </figcaption>
                  </figure>

                  <div className="flex gap-3 items-start">
                    <Calendar className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/90 font-medium mb-1">
                        What to Expect
                      </p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        During the consultation, we&apos;ll discuss your
                        specific requirements, answer questions, and help you
                        determine the best solution for your needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Calendly Widget */}
              <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-12 overflow-hidden">
                <div className="w-full max-w-2xl mx-auto flex flex-col h-full gap-4">
                  {/* Calendly Widget Container */}
                  <div style={{ minHeight: "700px" }}>
                    <div
                      key={isOpen ? "open" : "closed"}
                      className="calendly-inline-widget"
                      data-url={calendlyUrl}
                      style={{ minWidth: "320px", height: "700px" }}
                      ref={widgetRef}
                    />
                    <Script
                      src="https://assets.calendly.com/assets/external/widget.js"
                      strategy="afterInteractive"
                      onLoad={() => {
                        setScriptLoaded(true);
                      }}
                    />
                  </div>

                  {/* Bottom Message */}
                  <div className="space-y-3 shrink-0">
                    {consultationScheduled && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg"
                      >
                        <CheckCircle className="size-4" />
                        <span>Consultation scheduled successfully!</span>
                      </motion.div>
                    )}

                    {/* <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 text-center">
                      <p className="text-white/70 text-xs leading-relaxed">
                        Sales will be finalized after the meeting. Our team will
                        contact you following the consultation to complete your
                        purchase.
                      </p>
                    </div> */}

                    <button
                      onClick={handleClose}
                      className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      {consultationScheduled ? "Close" : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
