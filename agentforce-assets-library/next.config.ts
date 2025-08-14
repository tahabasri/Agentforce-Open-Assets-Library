
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
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
  // Removed headers as they don't work with output: export
};

export default nextConfig;
