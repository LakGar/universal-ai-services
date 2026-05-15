"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import {
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { useContact } from "@/contexts/contact-context";

function Footer() {
  const { openContact } = useContact();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services/buy" },
  ];

  const social = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/universalaiservices/",
    },
  ];

  return (
    <footer className="bg-black text-white border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">

          {/* LEFT SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Universal AI"
                width={42}
                height={42}
                className="invert"
              />

              <h3 className="text-2xl font-bold tracking-wide">
                Universal AI
              </h3>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-400 leading-7 text-sm max-w-sm">
              We help businesses transform using Artificial Intelligence,
              automation, and modern digital solutions.
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-4">
              {social.map((item, index) => {
                const Icon = item.icon;

                return (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-gray-900 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300"
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
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-xl font-semibold">
              Navigation
            </h4>

            <div className="space-y-3 text-gray-400">

              {navigation.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="block hover:text-white transition-all duration-300"
                >
                  {item.name}
                </Link>
              ))}

              <button
                onClick={openContact}
                className="block hover:text-white transition-all duration-300"
              >
                Contact Us
              </button>

            </div>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-xl font-semibold">
              Contact
            </h4>

            <div className="space-y-5 text-gray-400 text-sm">

              {/* EMAIL */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-white font-medium mb-1">
                    Email
                  </p>

                  <p>
                    contact@universalaiservices.com
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-white font-medium mb-1">
                    Phone
                  </p>

                  <p>
                    (650) 260-4147
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-white font-medium mb-1">
                    Address
                  </p>

                  <p>
                    995 Market St, San Francisco, CA
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-900 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

          <p className="text-center md:text-left">
            © 2026 Universal AI Services. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="hover:text-white transition-all duration-300"
            >
              Terms of Service | Privacy Policy
            </Link>
            {/* 
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-all duration-300"
            >
              Privacy Policy
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };