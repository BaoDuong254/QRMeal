import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import NextBundleAnalyzer from "@next/bundle-analyzer";
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
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
};

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(withNextIntl(nextConfig));
