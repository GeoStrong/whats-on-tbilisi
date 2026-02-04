/**
 * Hook for using optimized images in components
 * Handles async image fetching with proper loading states
 * Uses shared image cache context for browser-level persistence
 */

import { useEffect, useState } from "react";
import {
  getOptimizedImageUrl,
  getCachedOptimizedImageUrl,
} from "../data/supabaseFunctions";
import type { ImageType } from "../types";
import { useImageCache } from "../storage/ImageCacheContext";

interface UseOptimizedImageOptions {
  quality?: number;
  format?: "webp" | "jpg" | "png";
  width?: number;
  height?: number;
  fallback?: string;
}

export const useOptimizedImage = (
  imageLocation: ImageType,
  options: UseOptimizedImageOptions = {},
) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getCachedUrl, setCachedUrl } = useImageCache();

  useEffect(() => {
    if (!imageLocation) {
      setImageUrl(options.fallback || "");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Try browser localStorage cache first (persists across refreshes)
    let hadCache = false;
    const browserCached = getCachedUrl(imageLocation, {
      quality: options.quality,
      format: options.format,
      width: options.width,
      height: options.height,
    });

    if (browserCached) {
      hadCache = true;
      setImageUrl(browserCached);
      setIsLoading(false);
    } else {
      // Fallback to in-memory cache (per-process)
      try {
        const cached = getCachedOptimizedImageUrl(imageLocation, {
          quality: options.quality,
          format: options.format,
          width: options.width,
          height: options.height,
        });

        if (cached) {
          hadCache = true;
          setImageUrl(cached);
          setIsLoading(false);
          // Store in browser cache for persistence
          setCachedUrl(imageLocation, cached, {
            quality: options.quality,
            format: options.format,
            width: options.width,
            height: options.height,
          });
        }
      } catch (e) {
        // ignore cache errors and proceed to fetch
        console.error("Error reading cached optimized image URL:", e);
      }
    }

    const fetchImage = async () => {
      try {
        // Only set loading if we don't already have a cached URL
        if (!hadCache) setIsLoading(true);

        const url = await getOptimizedImageUrl(imageLocation, {
          quality: options.quality,
          format: options.format,
          width: options.width,
          height: options.height,
        });

        if (isMounted && url) {
          setImageUrl(url);
          setError(null);
          // Store in browser cache for future use
          setCachedUrl(imageLocation, url, {
            quality: options.quality,
            format: options.format,
            width: options.width,
            height: options.height,
          });
        } else if (isMounted) {
          setImageUrl(options.fallback || "");
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setImageUrl(options.fallback || "");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [
    imageLocation,
    options.quality,
    options.format,
    options.width,
    options.height,
    options.fallback,
    getCachedUrl,
    setCachedUrl,
  ]);

  return { imageUrl, isLoading, error };
};

export default useOptimizedImage;
