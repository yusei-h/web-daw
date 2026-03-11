import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/web-daw',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
