import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
const API_TIMKERJA = process.env.NEXT_PUBLIC_API_TIMKERJA!

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/timkerja/:path*",
        destination: `${API_TIMKERJA}/:path*`
      },
      {
        source: "/api/v1/:path*",
        destination: `${API_URL}/api/v1/:path*`
      },
      {
        source: "/auth/:path*",
        destination: `${API_URL}/auth/:path*`
      },
      {
        source: "/user-info",
        destination: `${API_URL}/user-info`
      }
    ]
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.kertaskerja.cc",
        pathname: "/logo/**"
      },
    ],
  },
};

export default nextConfig;
