"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { 
  Search, 
  Wrench, 
  Link2, 
  TrendingUp 
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover / Configure",
    description: "Browse our curated selection of production-ready robotics and AI systems. Select from our catalog or specify custom requirements.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
  },
  {
    number: "02",
    icon: Wrench,
    title: "Build / Customize",
    description: "Our engineering team works with you to configure hardware, develop custom software, and integrate with your existing systems.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
  },
  {
    number: "03",
    icon: Link2,
    title: "Integrate / Deploy",
    description: "We handle installation, system integration, and deployment. Your solution arrives configured and ready for production use.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Scale / Maintain",
    description: "Continuous monitoring, firmware updates, and technical support ensure your system performs optimally as you scale.",
    image: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=600&auto=format&fit=crop&q=80",
  },
];

export const HowItWorks = ({ className }: { className?: string }) => {
  return (
    <section className={cn("py-24 md:py-32 bg-muted/30", className)}>
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
            From Selection to Production
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A streamlined process that delivers production-ready robotic solutions, fully integrated and optimized for your operations.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <div className="relative bg-background border border-border rounded-lg overflow-hidden h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md group">
                    {/* Image */}
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm text-primary font-semibold text-sm">
                          {step.number}
                        </div>
                        <div className="p-2 rounded-lg bg-background/90 backdrop-blur-sm">
                          <Icon className="h-4 w-4 text-foreground" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 p-6 lg:p-8">
                      {/* Title */}
                      <h3 className="text-xl font-semibold">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow connector for mobile/tablet */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
                        className="text-muted-foreground"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

