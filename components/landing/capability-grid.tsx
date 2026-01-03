"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Zap,
  Globe2,
  Puzzle,
  Settings,
  Headphones,
  ArrowRight,
} from "lucide-react";

const capabilities = [
  {
    icon: Zap,
    title: "Robotic Automation Systems",
    url: "/services/buy",
    description:
      "Production-grade robotic arms, autonomous systems, and intelligent automation platforms",
    hoverText:
      "Industrial robot arms, warehouse automation, and AI-powered robotic assistants ready for deployment",
    image:
      "https://images.unsplash.com/photo-1625314887424-9f190599bd56?w=800&auto=format&fit=crop&q=80",
  },
  {
    icon: Globe2,
    title: "Enterprise Web Platforms",
    url: "/services/buy",
    description:
      "Custom web applications and platforms that power your robotic operations",
    hoverText:
      "Full-stack solutions with real-time monitoring, control interfaces, and cloud connectivity",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80",
  },
  {
    icon: Puzzle,
    title: "System Integrations",
    url: "/services/accessories",
    description:
      "Seamless connections between robotics, software, and existing enterprise systems",
    hoverText:
      "API integrations, middleware solutions, and custom connectors for unified operations",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
  },
  {
    icon: Settings,
    title: "Custom Development",
    url: "/services/consultation",
    description:
      "Tailored robotic solutions and software features built to your specifications",
    hoverText:
      "Custom firmware, specialized algorithms, and proprietary features for unique use cases",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80",
  },
  {
    icon: Headphones,
    title: "Ongoing Support & Maintenance",
    url: "/services/repairs",
    description:
      "Dedicated technical support, firmware updates, and system optimization",
    hoverText:
      "24/7 monitoring, remote diagnostics, and proactive maintenance to ensure peak performance",
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop&q=80",
  },
];

export const CapabilityGrid = ({ className }: { className?: string }) => {
  return (
    <section className={cn("py-24 md:py-32 bg-background", className)}>
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-semibold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Modular Robotics Solutions
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Combine robotic hardware, enterprise software, and custom
            integrations. We handle the complexity—you get a production-ready
            system.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <motion.div
                key={capability.title}
                className="group relative cursor-pointer"
                onClick={() => (window.location.href = capability.url)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative h-full rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden group">
                  {/* Image Background */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={capability.image}
                      alt={capability.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 p-2 rounded-lg bg-background/90 backdrop-blur-sm">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {capability.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {capability.description}
                      </p>
                    </div>

                    <div className="overflow-hidden max-h-0 group-hover:max-h-96 transition-all duration-300">
                      <p className="text-sm text-muted-foreground/80 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                        {capability.hoverText}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore solutions</span>
                      <ArrowRight className="h-4 w-4" />
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
