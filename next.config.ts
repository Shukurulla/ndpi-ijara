import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tutorapp.asadbek-durdana.uz",
      },
    ],
  },
};

export default nextConfig;
