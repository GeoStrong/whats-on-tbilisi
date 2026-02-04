import { PixelRatio } from "react-native";

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpg" | "png";
  cache?: boolean;
}

export const generateOptimizedImageUrl = (
  signedUrl: string,
  options: ImageOptimizationOptions = {},
): string => {
  if (!signedUrl) return "";

  const { width, height, quality = 50, format = "webp", cache = true } = options;

  try {
    try {
      const u = new URL(signedUrl);
      if (
        u.hostname.endsWith(".r2.cloudflarestorage.com") ||
        u.hostname.includes("r2.cloudflarestorage.com")
      ) {
        return signedUrl;
      }
    } catch {}

    const url = new URL(signedUrl);
    url.searchParams.set("quality", quality.toString());
    url.searchParams.set("format", format);
    if (width) url.searchParams.set("width", width.toString());
    if (height) url.searchParams.set("height", height.toString());
    if (cache) url.searchParams.set("cache", "public");
    return url.toString();
  } catch {
    return signedUrl;
  }
};

export const calculateImageDimensions = (
  displayWidth: number,
  displayHeight: number,
  devicePixelRatio: number = PixelRatio.get(),
): { width: number; height: number } => {
  const clampedDPR = Math.min(Math.max(1, Math.round(devicePixelRatio * 2) / 2), 3);

  return {
    width: Math.ceil(displayWidth * clampedDPR),
    height: Math.ceil(displayHeight * clampedDPR),
  };
};

export const generateSrcSet = (
  signedUrl: string,
  displayWidth: number,
  displayHeight: number,
  quality = 50,
): string => {
  if (!signedUrl) return "";

  const densities = [1, 2];
  const srcSetParts = densities
    .map((dpr) => {
      const { width, height } = calculateImageDimensions(displayWidth, displayHeight, dpr);
      const url = generateOptimizedImageUrl(signedUrl, {
        width,
        height,
        quality: Math.max(Math.round(quality / dpr), 40),
        format: "webp",
      });
      return `${url} ${dpr}x`;
    })
    .join(", ");

  return srcSetParts;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const estimateBandwidthSavings = (
  originalSizeBytes: number,
  optimizationLevel: "low" | "medium" | "high" = "medium",
): string => {
  let savingsPercent = 0;

  switch (optimizationLevel) {
    case "low":
      savingsPercent = 20;
      break;
    case "medium":
      savingsPercent = 35;
      break;
    case "high":
      savingsPercent = 50;
      break;
  }

  const savedBytes = (originalSizeBytes * savingsPercent) / 100;
  return formatFileSize(savedBytes);
};
