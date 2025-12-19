import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import NextBundleAnalyzer from "@next/bundle-analyzer";
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // Enable standalone output for Docker
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4008",
        pathname: "/**",
      },
      {
        hostname: "placehold.co",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "**",
        protocol: "https",
      },
    ],
  },
  async rewrites() {
    // Rewrite /api/proxy/* to backend server (only for server-side)
    // This provides an alternative to the catch-all route for better performance
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:4008"}/:path*`,
      },
    ];
  },
};

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(withNextIntl(nextConfig));
