"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const About = ({ className }: { className?: string }) => {
  const title = "About Us";
  const description =
    "Universal AI Services is a AI & robotics consultancy that guides leaders through every stage of adoption with proven playbooks.";
  const mainImage = {
    src: "https://images.unsplash.com/photo-1581090121489-ff9b54bbee43?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJvYm90aWNzfGVufDB8fDB8fHww",
    alt: "AI and Robotics Technology",
  };
  const secondaryImage = {
    src: "https://images.unsplash.com/photo-1643199329419-1e46bbacf76c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fHJvYm90aWNzfGVufDB8fDB8fHww",
    alt: "Robotics Innovation",
  };
  const breakout = {
    title: "We believe AI is no longer optional.",
    description:
      "It has become the baseline for competitiveness, and companies that adopt it with speed and clarity will define the next decade.",
    buttonText: "Learn more",
    buttonUrl: "/about",
  };

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2">
          <motion.h1
            className="text-5xl font-semibold text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-muted-foreground text-lg text-left">
              {description}
            </p>
          </motion.div>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <motion.img
            src={mainImage.src}
            alt={mainImage.alt}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <motion.div
              className="flex flex-col justify-between gap-2 rounded-xl bg-muted p-8 md:w-1/2 lg:w-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {breakout.title && (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold leading-tight">
                    {breakout.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {breakout.description}
                  </p>
                </div>
              )}
              {breakout.buttonText && breakout.buttonUrl && (
                <Button variant="outline" className="mr-auto " asChild>
                  <a href={breakout.buttonUrl}>{breakout.buttonText}</a>
                </Button>
              )}
            </motion.div>
            <motion.img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { About };
