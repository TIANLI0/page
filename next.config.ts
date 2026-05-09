import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "q1.qlogo.cn",
      },
    ],
  },
};

export default nextConfig;
