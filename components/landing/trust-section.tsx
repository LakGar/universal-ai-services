"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CheckCircle2, Shield, Rocket, Layers } from "lucide-react";

const trustPoints = [
  {
    icon: CheckCircle2,
    title: "End-to-end integration handled",
    description:
      "From hardware procurement to software deployment, we manage the entire integration lifecycle. No fragmented vendors or coordination headaches.",
  },
  {
    icon: Rocket,
    title: "Production-ready deployments",
    description:
      "Every robotic system is factory-tested, calibrated, and validated before delivery. Deploy to your facility with confidence.",
  },
  {
    icon: Layers,
    title: "Custom + off-the-shelf support",
    description:
      "Mix standard robotic platforms with proprietary software and custom hardware modifications. One unified solution.",
  },
  {
    icon: Shield,
    title: "Built to scale with your business",
    description:
      "Architecture designed for growth. Start with a single unit and scale to fleet operations without system redesign.",
  },
];

export const TrustSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn("py-24 md:py-32 relative overflow-hidden", className)}
    >
      {/* Dark Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1484740168222-9edf6e11cec3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHJvYm90aWNzfGVufDB8MHwwfHx8MA%3D%3D"
          alt="Robotics background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Enterprise-Grade Reliability
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Production systems, proven processes, and delivery standards trusted
            by leading organizations.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:border-primary/50 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-white/10 text-white flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        {point.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
