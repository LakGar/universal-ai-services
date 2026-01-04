import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "robostore.com",
      },
      {
        protocol: "https",
        hostname: "www.usrobotstore.com",
      },
      {
        protocol: "https",
        hostname: "static.tildacdn.com",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
      {
        protocol: "https",
        hostname: "www.opendroids.com",
      },
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
      },
    ],
  },
};

export default nextConfig;
