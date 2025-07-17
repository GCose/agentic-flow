import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/leads",
        destination: "http://178.63.40.80:5500/api/leads/", // Proxy to external API
      },
    ];
  },
};

export default nextConfig;