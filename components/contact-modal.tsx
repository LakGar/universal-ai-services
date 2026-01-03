"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Check, Mail, Phone, MapPin } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  layoutId?: string;
}

export function ContactModal({ isOpen, onClose, layoutId = "contact-button" }: ContactModalProps) {
  const [formStep, setFormStep] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStep("submitting");
    // Simulate API call
    setTimeout(() => {
      setFormStep("success");
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    // Reset form after a brief delay so the user doesn't see it reset while closing
    setTimeout(() => setFormStep("idle"), 500);
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
              {/* Left Side: Contact Info */}
              <div className="hidden flex-1 md:flex flex-col justify-center p-8 sm:p-12 lg:p-16 gap-8 text-white">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                    Get in Touch
                  </h2>
                  <p className="text-white/80 text-lg max-w-md">
                    Have questions? We&apos;re here to help. Reach out to our team and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Mail className="w-6 h-6 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Email Us
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">
                        info@universalaiservices.com
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Phone className="w-6 h-6 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Call Us
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <MapPin className="w-6 h-6 text-white/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Visit Us
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mt-1">
                        123 Innovation Drive<br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/20">
                  <p className="text-white/70 text-sm leading-relaxed">
                    Our support team is available Monday through Friday, 9 AM to 6 PM PST. For urgent matters, please call our emergency line.
                  </p>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-16 bg-black/10 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  {formStep === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center h-[400px] space-y-6"
                    >
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                        <Check className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-white/80">
                          We&apos;ve received your message and will get back to you within 24 hours.
                        </p>
                      </div>
                      <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-white">
                          Contact Us
                        </h3>
                        <p className="text-sm text-white/70">
                          Fill out the form below and we&apos;ll get back to you.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider"
                          >
                            Full Name
                          </label>
                          <input
                            required
                            type="text"
                            id="contact-name"
                            placeholder="Jane Doe"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider"
                          >
                            Email
                          </label>
                          <input
                            required
                            type="email"
                            id="contact-email"
                            placeholder="jane@company.com"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-subject"
                            className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider"
                          >
                            Subject
                          </label>
                          <input
                            required
                            type="text"
                            id="contact-subject"
                            placeholder="How can we help?"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-message"
                            className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider"
                          >
                            Message
                          </label>
                          <textarea
                            required
                            id="contact-message"
                            rows={4}
                            placeholder="Tell us more about your inquiry..."
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all resize-none text-sm"
                          />
                        </div>
                      </div>

                      <button
                        disabled={formStep === "submitting"}
                        type="submit"
                        className="w-full flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90 focus:ring-4 focus:ring-white/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                      >
                        {formStep === "submitting" ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            Sending...
                          </span>
                        ) : (
                          "Send Message"
                        )}
                      </button>

                      <p className="text-xs text-center text-white/50 mt-4">
                        By submitting, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

