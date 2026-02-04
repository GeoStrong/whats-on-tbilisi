/**
 * Image optimization utilities for Supabase images
 * Handles quality, format, and caching to reduce bandwidth and improve performance
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: "webp" | "jpg" | "png";
  cache?: boolean;
}

/**
 * This uses Supabase's image transformation capabilities
 */
export const generateOptimizedImageUrl = (
  signedUrl: string,
  options: ImageOptimizationOptions = {},
): string => {
  if (!signedUrl) return "";

  const {
    width,
    height,
    quality = 50, // Default quality: 50% to balance quality and file size
    format = "webp", // Default to WebP for better compression
    cache = true,
  } = options;

  try {
    // If this is an R2 signed URL, do not attempt to append query params
    // because the signature will become invalid. We detect by hostname
    // to avoid relying on environment variables.
    try {
      const u = new URL(signedUrl);
      if (
        u.hostname.endsWith(".r2.cloudflarestorage.com") ||
        u.hostname.includes("r2.cloudflarestorage.com")
      ) {
        return signedUrl;
      }
    } catch {
      // If URL parsing fails, continue and try to treat it as a normal URL
    }
    const url = new URL(signedUrl);

    // Add quality parameter (lower quality = smaller file = less cache egress)
    url.searchParams.set("quality", quality.toString());

    // Add format parameter for automatic conversion
    url.searchParams.set("format", format);

    // Add width/height if provided for responsive images
    if (width) {
      url.searchParams.set("width", width.toString());
    }
    if (height) {
      url.searchParams.set("height", height.toString());
    }

    // Add cache control headers suggestion (Supabase respects these)
    if (cache) {
      // This helps with browser caching
      url.searchParams.set("cache", "public");
    }

    return url.toString();
  } catch {
    return signedUrl;
  }
};

/**
 * Calculates appropriate image dimensions based on device pixel ratio
 * Helps deliver high-quality images without wasting bandwidth
 */
export const calculateImageDimensions = (
  displayWidth: number,
  displayHeight: number,
  devicePixelRatio: number = typeof window !== "undefined"
    ? window.devicePixelRatio
    : 1,
): { width: number; height: number } => {
  // Clamp DPR to reasonable values (1, 1.5, 2, 3)
  const clampedDPR = Math.min(
    Math.max(1, Math.round(devicePixelRatio * 2) / 2),
    3,
  );

  return {
    width: Math.ceil(displayWidth * clampedDPR),
    height: Math.ceil(displayHeight * clampedDPR),
  };
};

/**
 * Generates srcSet string for responsive images with different resolutions
 * Helps browsers choose the right resolution for the device
 */
export const generateSrcSet = (
  signedUrl: string,
  displayWidth: number,
  displayHeight: number,
  quality = 50,
): string => {
  if (!signedUrl) return "";

  // Generate URLs for 1x and 2x pixel densities only to reduce distinct variants
  const densities = [1, 2];
  const srcSetParts = densities
    .map((dpr) => {
      const { width, height } = calculateImageDimensions(
        displayWidth,
        displayHeight,
        dpr,
      );
      const url = generateOptimizedImageUrl(signedUrl, {
        width,
        height,
        quality: Math.max(Math.round(quality / dpr), 40), // Lower quality for higher DPR
        format: "webp",
      });
      return `${url} ${dpr}x`;
    })
    .join(", ");

  return srcSetParts;
};

/**
 * Formats file size in human-readable format
 * Useful for monitoring cache egress
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Estimates bandwidth saved by using optimized images
 * Quality: 75%, WebP format typically saves 30-40% vs JPEG
 */
export const estimateBandwidthSavings = (
  originalSizeBytes: number,
  optimizationLevel: "low" | "medium" | "high" = "medium",
): string => {
  let savingsPercent = 0;

  switch (optimizationLevel) {
    case "low":
      savingsPercent = 20; // ~20% savings with light optimization
      break;
    case "medium":
      savingsPercent = 35; // ~35% savings with WebP + quality 75
      break;
    case "high":
      savingsPercent = 50; // ~50% savings with aggressive optimization
      break;
  }

  const savedBytes = (originalSizeBytes * savingsPercent) / 100;
  return formatFileSize(savedBytes);
};
