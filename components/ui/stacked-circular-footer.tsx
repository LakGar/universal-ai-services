"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function Footer() {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "#services" },
    { name: "Products", href: "/services/buy" },
    { name: "Contact", href: "#contact" },
  ];

  const social = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/universalaiservices/",
    },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Facebook, href: "#" },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* LOGO + DESCRIPTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Universal AI"
                width={40}
                height={40}
                className="invert"
              />
              <h3 className="text-xl font-semibold">
                Universal AI
              </h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              We help businesses transform using Artificial Intelligence,
              automation, and modern digital solutions.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-6">
              {social.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    className="p-2 rounded-full bg-gray-800 hover:bg-primary transition"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* NAVIGATION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4">Navigation</h4>

            <ul className="space-y-3 text-gray-400">
              {navigation.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4">Contact</h4>

            <div className="space-y-4 text-gray-400 text-sm">

              <div className="flex gap-3 items-start">
                <Mail size={18} />
                <span>contact@universalaiservices.com</span>
              </div>

              <div className="flex gap-3 items-start">
                <Phone size={18} />
                <span>(650) 260-4147</span>
              </div>

              <div className="flex gap-3 items-start">
                <MapPin size={18} />
                <span>995 Market St, San Francisco, CA</span>
              </div>

            </div>
          </motion.div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">

          <p>
            © 2026 Universal AI Services. All rights reserved.
          </p>

          <div className="flex gap-6 mt-3 md:mt-0">
            {/* <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link> */}

            <Link href="/terms" className="hover:text-white transition">
              Terms of Service | Privacy Policy
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}

export { Footer };