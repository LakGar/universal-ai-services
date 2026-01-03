"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, Calendar } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface AddOnConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  addOn: {
    id: string;
    name: string;
    image: string;
    priceStr: string;
    description: string;
  } | null;
  onConsultationScheduled?: (addOnId: string) => void;
}

export function AddOnConsultationModal({
  isOpen,
  onClose,
  addOn,
  onConsultationScheduled,
}: AddOnConsultationModalProps) {
  const [consultationScheduled, setConsultationScheduled] = useState(false);
  const [widgetLoading, setWidgetLoading] = useState(true);
  const [widgetError, setWidgetError] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetInitialized = useRef(false);
  const loadCalendlyRef = useRef<(() => void) | null>(null);
  const calendlyUrl = "https://calendly.com/lakgarg2002/advisory-meeting-1";

  // Load Calendly widget
  useEffect(() => {
    // Wait for modal to be open and ref to be available
    if (!isOpen) {
      // Reset state when modal closes
      widgetInitialized.current = false;
      setWidgetLoading(true);
      setWidgetError(false);
      return;
    }

    // Wait for ref to be available
    if (!widgetRef.current) {
      // Small delay to ensure ref is set
      const timeout = setTimeout(() => {
        if (widgetRef.current) {
          // Trigger re-run by setting a flag
        }
      }, 100);
      return () => clearTimeout(timeout);
    }

    // Load Calendly widget script
    const loadCalendly = () => {
      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );

      const initWidget = () => {
        // Prevent double initialization - check if widget already exists
        if (!widgetRef.current) {
          setWidgetLoading(false);
          setWidgetError(true);
          return;
        }

        // Check if widget is already initialized by looking for iframe
        const hasWidget = widgetRef.current.querySelector("iframe");
        if (hasWidget && widgetInitialized.current) {
          setWidgetLoading(false);
          setWidgetError(false);
          return;
        }

        if ((window as any).Calendly?.initInlineWidget) {
          try {
            // Only clear if not already initialized
            if (!widgetInitialized.current) {
              widgetRef.current.innerHTML = "";
            }

            (window as any).Calendly.initInlineWidget({
              url: calendlyUrl,
              parentElement: widgetRef.current,
            });
            widgetInitialized.current = true;
            setWidgetLoading(false);
            setWidgetError(false);
          } catch (error) {
            console.error("Error initializing Calendly widget:", error);
            setWidgetLoading(false);
            setWidgetError(true);
          }
        } else {
          // Calendly not ready yet, keep waiting
          setWidgetLoading(true);
        }
      };

      if (existingScript && (window as any).Calendly) {
        // Calendly is already loaded, initialize widget
        setTimeout(() => {
          initWidget();
        }, 100);
        return;
      }

      if (!existingScript) {
        // Load the script
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.onload = () => {
          // Wait a bit for Calendly to fully initialize, then check multiple times
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds total
          const checkInterval = setInterval(() => {
            attempts++;
            if ((window as any).Calendly?.initInlineWidget) {
              clearInterval(checkInterval);
              setTimeout(() => {
                initWidget();
              }, 100);
            } else if (attempts >= maxAttempts) {
              clearInterval(checkInterval);
              setWidgetLoading(false);
              setWidgetError(true);
            }
          }, 100);
        };
        script.onerror = () => {
          setWidgetLoading(false);
          setWidgetError(true);
        };
        document.head.appendChild(script);
      } else {
        // Script exists but might not be loaded yet, wait for it
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds total
        const checkCalendly = setInterval(() => {
          attempts++;
          if ((window as any).Calendly?.initInlineWidget) {
            clearInterval(checkCalendly);
            initWidget();
          } else if (attempts >= maxAttempts) {
            clearInterval(checkCalendly);
            setWidgetLoading(false);
            setWidgetError(true);
            // Don't try to reload automatically - let user retry manually
          }
        }, 100);
      }
    };

    // Store loadCalendly function in ref so it can be accessed elsewhere
    loadCalendlyRef.current = loadCalendly;

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      loadCalendly();
    }, 100);

    // Listen for Calendly event when consultation is scheduled
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data?.event && e.data.event.indexOf("calendly") === 0) {
        if (e.data.event === "calendly.event_scheduled") {
          setConsultationScheduled(true);
          if (addOn && onConsultationScheduled) {
            onConsultationScheduled(addOn.id);
          }
        }
      }
    };

    window.addEventListener("message", handleCalendlyEvent);

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener("message", handleCalendlyEvent);
    };
  }, [isOpen, addOn, onConsultationScheduled, calendlyUrl]);

  // Reset consultation scheduled state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setConsultationScheduled(false);
      }, 500);
    }
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

  if (!addOn) return null;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              onClick={onClose}
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
              {/* Left Side: Selected Product Info */}
              <div className="hidden flex-1 md:flex flex-col justify-center p-8 sm:p-12 lg:p-16 gap-8 text-white">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                    Schedule Consultation
                  </h2>
                  <p className="text-white/80 text-lg max-w-md">
                    Let&apos;s discuss how {addOn.name} can meet your needs. Schedule a consultation with our team.
                  </p>
                </div>

                {/* Selected Product Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 shrink-0">
                      <AspectRatio
                        ratio={1}
                        className="bg-white/10 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={addOn.image}
                          alt={addOn.name}
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{addOn.name}</h3>
                      <p className="text-white/70 text-sm mb-2">{addOn.priceStr}</p>
                      {consultationScheduled && (
                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                          <CheckCircle className="size-4" />
                          <span>Consultation Scheduled</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {addOn.description && (
                    <p className="text-white/70 text-sm leading-relaxed">
                      {addOn.description}
                    </p>
                  )}
                </div>

                {/* Info Message */}
                <div className="mt-auto pt-8 border-t border-white/20">
                  <div className="flex gap-3 items-start">
                    <Calendar className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/90 font-medium mb-1">
                        What to Expect
                      </p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        During the consultation, we&apos;ll discuss your specific requirements, answer questions, and help you determine the best solution for your needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Calendly Widget */}
              <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-12 bg-black/10 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none overflow-hidden">
                <div className="w-full max-w-2xl mx-auto flex flex-col h-full gap-4">
                  {/* Calendly Widget Container */}
                  <div className="flex-1 w-full overflow-hidden rounded-lg mb-2 relative min-h-0">
                    {widgetLoading && !widgetError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 rounded-lg">
                        <div className="text-center">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mb-2" />
                          <p className="text-sm text-white/80">
                            Loading calendar...
                          </p>
                        </div>
                      </div>
                    )}
                    {widgetError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 rounded-lg px-6">
                        <div className="text-center max-w-md">
                          <p className="text-sm text-white/90 mb-4">
                            Unable to load calendar widget. This might be due to an
                            ad blocker or network issue.
                          </p>
                          <button
                            onClick={() => {
                              window.open(calendlyUrl, "_blank", "noopener,noreferrer");
                            }}
                            className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium mb-2"
                          >
                            Open Calendar in New Tab
                          </button>
                          <button
                            onClick={() => {
                              setWidgetError(false);
                              setWidgetLoading(true);
                              widgetInitialized.current = false;
                              if (widgetRef.current) {
                                widgetRef.current.innerHTML = "";
                              }
                              // Retry loading
                              const script = document.querySelector(
                                'script[src="https://assets.calendly.com/assets/external/widget.js"]'
                              );
                              if (script) {
                                script.remove();
                              }
                              setTimeout(() => {
                                if (loadCalendlyRef.current) {
                                  loadCalendlyRef.current();
                                }
                              }, 500);
                            }}
                            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            Retry Loading Widget
                          </button>
                        </div>
                      </div>
                    )}
                    <div
                      ref={widgetRef}
                      className="w-full h-full calendly-inline-widget"
                      style={{ minHeight: "600px" }}
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
                    
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-center">
                      <p className="text-white/90 text-sm font-medium mb-1">
                        Next Steps
                      </p>
                      <p className="text-white/70 text-xs leading-relaxed">
                        Sales will be finalized after the meeting. Our team will contact you following the consultation to complete your purchase.
                      </p>
                    </div>

                    <button
                      onClick={onClose}
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

