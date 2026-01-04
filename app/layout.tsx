import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { ContactProvider } from "@/contexts/contact-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universal AI Services - Robotics & AI Solutions",
  description: "Universal AI Services is an AI & robotics consultancy that guides leaders through every stage of adoption with proven playbooks. Buy, rent, or consult on cutting-edge robotics solutions.",
  keywords: ["robotics", "AI", "artificial intelligence", "robots", "automation", "consulting"],
  authors: [{ name: "Universal AI Services" }],
  creator: "Universal AI Services",
  publisher: "Universal AI Services",
  metadataBase: new URL("https://universalaiservices.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://universalaiservices.com",
    siteName: "Universal AI Services",
    title: "Universal AI Services - Robotics & AI Solutions",
    description: "Universal AI Services is an AI & robotics consultancy that guides leaders through every stage of adoption with proven playbooks.",
  },
  other: {
    "contact:email": "contact@universalaiservices.com",
    "contact:phone": "(650) 260-4147",
    "contact:address": "450 Townsend St, San Francisco, CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&family=Zalando+Sans+Expanded:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <WishlistProvider>
            <ContactProvider>
              {children}
            </ContactProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
