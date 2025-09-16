import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "flagcdn.com",      
    ],
  },
};

export default nextConfig;
