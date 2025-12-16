import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's0.wp.com',
        port: '',
        pathname: '/mshots/v1/**',
      },
    ],
  },
};

export default nextConfig;
