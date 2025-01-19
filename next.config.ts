import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.lovepik.com', // New hostname for the image
        port: '',
        pathname: '/free-png/**', // Path pattern for your specific image
        search: '',
      },
    ],
  },
};
export default nextConfig;
