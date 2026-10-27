import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/letter/**",
        search: "?v=2",
      },
      {
        pathname: "/v2/**",
      },
      {
        pathname: "/v3/**",
      },
    ],
  },
};

export default nextConfig;
