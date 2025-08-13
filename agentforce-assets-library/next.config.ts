
import type { NextConfig } from "next";

const repo = 'Agentforce-Open-Assets-Library';
const nextConfig: NextConfig = {
  output: 'export',
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
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
};

export default nextConfig;
