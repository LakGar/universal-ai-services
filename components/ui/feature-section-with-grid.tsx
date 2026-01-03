"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function Feature() {
  return (
    <section id="services" className="w-full  p-4">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <motion.div
            className="flex gap-4 flex-col items-start"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Badge>Services</Badge>
            </motion.div>
            <div className="flex gap-2 flex-col">
              <motion.h2
                className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Something you need!
              </motion.h2>
              <motion.p
                className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                We offer a wide range of services to help you with your
                business.
              </motion.p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                href: "/services/buy",
                name: "Buy a robot",
                description:
                  "We offer a wide range of robots to choose from, to suit your needs.",
                image:
                  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
                alt: "Buy a robot",
              },
              {
                href: "/services/rent",
                name: "Rent a robot",
                description: "Find a robot to rent for any event or project.",
                image:
                  "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800&q=80",
                alt: "Rent a robot",
              },
              {
                href: "/services/accessories",
                name: "Accessories",
                description: "Find the perfect accessory for your robot.",
                image:
                  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
                alt: "Accessories",
              },
              {
                href: "/services/repairs",
                name: "Repairs",
                description: "Get your robot repaired by our experts.",
                image:
                  "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
                alt: "Repairs",
              },
              {
                href: "/services/consultation",
                name: "Consultations",
                description: "Book a consultation with our experts.",
                image:
                  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
                alt: "Consultations",
              },
              {
                href: "/services/events",
                name: "Events",
                description: "Attend an event or Host your own.",
                image:
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXZlbnR8ZW58MHx8MHx8fDA%3D",
                alt: "Events",
              },
            ].map((service, index) => (
              <motion.div
                key={service.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Link
                  href={service.href}
                  className="flex flex-col gap-2 group cursor-pointer transition-all duration-300 hover:scale-105 "
                >
                  <div className="relative rounded-md aspect-video mb-2 overflow-hidden bg-muted">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl tracking-tight group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-base">
                    {service.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { Feature };
