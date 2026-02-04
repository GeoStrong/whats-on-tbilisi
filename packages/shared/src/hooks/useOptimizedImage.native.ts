import { useEffect, useState } from "react";
import { getOptimizedImageUrl, getCachedOptimizedImageUrl } from "../data/supabaseFunctions";
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
    let hadCache = false;

    const run = async () => {
      try {
        const browserCached = await getCachedUrl(imageLocation, {
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
              await setCachedUrl(imageLocation, cached, {
                quality: options.quality,
                format: options.format,
                width: options.width,
                height: options.height,
              });
            }
          } catch {
            // ignore cache errors
          }
        }

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
          await setCachedUrl(imageLocation, url, {
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
        if (isMounted) setIsLoading(false);
      }
    };

    run();

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
