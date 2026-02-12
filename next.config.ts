import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "inter.malspy.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
