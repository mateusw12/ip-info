import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  compress: true,
};

export default nextConfig;
