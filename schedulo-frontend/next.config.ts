import type { NextConfig } from "next";
import dotenv from "dotenv";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_DEPLOYED_URL: process.env.NEXT_DEPLOYED_URL,
  },
};

export default nextConfig;
