"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  generateOptimizedImageUrl,
  generateSrcSet,
} from "@/lib/functions/imageOptimization";
import { Skeleton } from "./skeleton";

interface OptimizedImageProps {
  src: string; // Should be the signed URL from Supabase
  alt: string;
  width: number;
  height: number;
  quality?: number; // 1-100, default 75
  priority?: boolean;
  className?: string;
  objectFit?: "contain" | "cover" | "fill";
  objectPosition?: string;
  placeholder?: "blur" | "empty";
  sizes?: string;
  onLoad?: () => void;
  containerClassName?: string;
}

/**
 * OptimizedImage Component
 *
 * Provides intelligent image optimization with:
 * - Automatic WebP format conversion
 * - Quality adjustment (default 75%) to reduce cache egress
 * - Responsive srcSet for high-DPI displays (1x, 1.5x, 2x, 3x)
 * - Native lazy loading for off-screen images
 * - Blur placeholder during loading
 * - Proper aspect ratio maintenance to prevent CLS
 *
 * Usage:
 * ```tsx
 * <OptimizedImage
 *   src={signedUrl}
 *   alt="Activity"
 *   width={400}
 *   height={300}
 *   quality={75}
 *   priority={false}
 * />
 * ```
 */
const OptimizedImage = React.forwardRef<HTMLDivElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      quality = 50,
      priority = false,
      className = "",
      objectFit = "cover",
      objectPosition = "center",
      placeholder = "blur",
      sizes,
      onLoad,
      containerClassName = "",
    },
    ref,
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [srcSet, setSrcSet] = useState<string>("");
    const [optimizedSrc, setOptimizedSrc] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    // Generate responsive srcSet
    useEffect(() => {
      if (!src) return;

      try {
        const responsiveSrcSet = generateSrcSet(src, width, height, quality);
        setSrcSet(responsiveSrcSet);

        // Main optimized image URL
        const optimized = generateOptimizedImageUrl(src, {
          width,
          height,
          quality,
          format: "webp",
          cache: true,
        });
        setOptimizedSrc(optimized);
      } catch (error) {
        console.error("Error generating optimized image URL:", error);
        setOptimizedSrc(src);
      }
    }, [src, width, height, quality]);

    // Set up intersection observer for lazy loading
    useEffect(() => {
      if (priority) {
        setInView(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        },
        {
          rootMargin: "50px", // Start loading 50px before entering viewport
        },
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, [priority]);

    const handleLoadingComplete = useCallback(() => {
      setIsLoading(false);
      onLoad?.();
    }, [onLoad]);

    const blurPlaceholder = placeholder === "blur" ? "blur(10px)" : "none";

    // Don't render until image is in view (unless priority)
    const shouldRender = priority || inView;

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (ref) {
            if (typeof ref === "function") {
              ref(node);
            } else {
              ref.current = node;
            }
          }
        }}
        className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${containerClassName}`}
        style={{
          aspectRatio: `${width} / ${height}`,
        }}
      >
        {/* Loading state placeholder */}
        {isLoading && placeholder === "blur" && (
          <Skeleton className="absolute inset-0" />
        )}

        {/* Actual image - only render if in view or priority */}
        {shouldRender && optimizedSrc && (
          <Image
            src={optimizedSrc}
            alt={alt}
            fill
            sizes={
              sizes ||
              `(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw`
            }
            quality={50} // Next.js quality for next/image optimization
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className={`${className} ${
              isLoading ? "scale-105" : "scale-100"
            } transition-all duration-300`}
            style={{
              objectFit: objectFit,
              objectPosition: objectPosition,
              filter: isLoading ? blurPlaceholder : "none",
            }}
            onLoad={handleLoadingComplete}
            decoding="async"
          />
        )}

        {/* Responsive srcSet fallback */}
        {srcSet && (
          <picture style={{ display: "none" }}>
            <source srcSet={srcSet} type="image/webp" />
            <img src={optimizedSrc} alt={alt} />
          </picture>
        )}
      </div>
    );
  },
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
