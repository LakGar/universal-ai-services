"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { X, CheckCircle, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import { logger } from "@/lib/logger";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  layoutId?: string;
}

export function ContactModal({
  isOpen,
  onClose,
  layoutId = "contact-button",
}: ContactModalProps) {
  const [consultationScheduled, setConsultationScheduled] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const calendlyUrl = "https://calendly.com/lakgarg2002/advisory-meeting-1";

  const handleClose = () => {
    onClose();
  };

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
      if ((window as any).Calendly?.initInlineWidget) {
        try {
          (window as any).Calendly.initInlineWidget({
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
    if ((window as any).Calendly?.initInlineWidget) {
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
        if ((window as any).Calendly?.initInlineWidget) {
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
              {/* Left Side: Contact Info */}
              <div className="hidden flex-1 md:flex flex-col justify-center p-8 sm:p-12 lg:p-16 gap-8 text-white">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                    Get in Touch
                  </h2>
                  <p className="text-white/80 text-lg max-w-md">
                    Have questions? We&apos;re here to help. Reach out to our
                    team and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Mail className="w-6 h-6 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email Us</h3>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">
                        contact@universalaiservices.com
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Phone className="w-6 h-6 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Call Us</h3>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">
                        (650) 260-4147
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <MapPin className="w-6 h-6 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Visit Us</h3>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">
                        450 Townsend St
                        <br />
                        San Francisco, CA
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/20 space-y-6">
                  <div className="flex gap-3 items-start">
                    <Calendar className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/90 font-medium mb-1">
                        Schedule a Consultation
                      </p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Book a meeting with our team to discuss your needs and
                        explore how we can help you.
                      </p>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Our support team is available Monday through Friday, 9 AM to
                    6 PM PST. For urgent matters, please call our emergency
                    line.
                  </p>
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
