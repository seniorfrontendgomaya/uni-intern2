import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import { DEFAULT_API_BASE_URL } from "./src/config/api-domain";

const apiBase = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;
const apiOrigin = apiBase.replace(/\/$/, "");
const apiHostname = new URL(apiOrigin).hostname;

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: apiHostname,
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: apiHostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "inter.malspy.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "inter.malspy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_API_URL as string,
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_API_URL as string,
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/media/:path*",
        destination: `${apiOrigin}/media/:path*`,
      },
    ];
  },
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
});

export default withPWA(nextConfig);
