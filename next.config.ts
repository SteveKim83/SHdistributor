import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['drive.google.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
