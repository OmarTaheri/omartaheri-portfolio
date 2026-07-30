import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The deployed worker serves the already-optimized WebP assets directly.
    // Avoid generating runtime image-proxy URLs that are unavailable on Sites.
    unoptimized: true,
  },
};

export default nextConfig;
