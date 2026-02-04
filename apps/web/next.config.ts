import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import path from "path";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@whatson/shared", "@whatson/ui"],
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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "geostrong",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/shared": path.resolve(__dirname, "../../packages/shared"),
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.ts",
      ".web.tsx",
      ".web.js",
      ".web.jsx",
      ...(config.resolve.extensions || []),
    ];
    return config;
  },
});
