import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com', 'yoqhhfzgucuarcyskigr.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.lovepik.com',
        port: '',
        pathname: '/free-png/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Path for the API requests on the frontend
        destination: "http://localhost:8080/api/:path*", // Proxy to the backend API
      },
    ];
  },
};

export default nextConfig;
