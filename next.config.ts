import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        pathname: "/**",
      },
    ],
    // Enable automatic WebP conversion and responsive image optimization
    formats: ["image/avif", "image/webp"],
    // Add qualities used across the app to avoid Next.js unconfigured qualities errors
    qualities: [50, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    // Optimize device sizes for common breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Set cache header for the next/image output for optimized images and add security headers
  async headers() {
    return [
      {
        // Match the next/image route that serves optimized images
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, immutable, stale-while-revalidate=31536000",
          },
        ],
      },
      {
        // Security headers for all routes
        source: "/:path(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=()",
          },
        ],
      },
    ];
  },
  /* Compression settings for optimal performance */
  compress: true,
  /* Optimize production builds */
  productionBrowserSourceMaps: false,
};

export default nextConfig;
