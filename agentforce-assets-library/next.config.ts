import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.sfdcdigital.com',
      },
      {
        protocol: 'https',
        hostname: 'appexchange.salesforce.com',
      }
    ]
  }
};

export default nextConfig;
