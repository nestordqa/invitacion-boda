import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/letter/**",
        search: "?v=2",
      },
    ],
  },
};

export default nextConfig;
