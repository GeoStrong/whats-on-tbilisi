import { Image } from "react-native";
import { getOptimizedImageUrl } from "../data/supabaseFunctions";
import type { ImageType } from "../types";

interface PreloadOptions {
  quality?: number;
  format?: "webp" | "jpg" | "png";
  width?: number;
  height?: number;
}

export const preloadImage = (
  imageLocation: ImageType,
  options?: PreloadOptions,
): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!imageLocation) {
      resolve(null);
      return;
    }

    getOptimizedImageUrl(imageLocation, {
      quality: options?.quality || 50,
      format: options?.format || "webp",
      width: options?.width,
      height: options?.height,
    })
      .then(async (url) => {
        if (!url) {
          resolve(null);
          return;
        }
        try {
          await Image.prefetch(url);
          resolve(url);
        } catch {
          resolve(null);
        }
      })
      .catch(() => resolve(null));
  });
};

export const preloadImages = async (
  imageLocations: ImageType[],
  options?: PreloadOptions,
): Promise<(string | null)[]> => {
  const promises = imageLocations.map((location) =>
    preloadImage(location, options),
  );
  return Promise.all(promises);
};

export const preloadActivityImages = async (
  activities: Array<{ image?: ImageType | null }>,
  options?: PreloadOptions,
): Promise<void> => {
  const images = activities
    .slice(0, 6)
    .map((activity) => activity.image)
    .filter((img): img is ImageType => !!img);

  await preloadImages(images, {
    quality: options?.quality || 75,
    format: options?.format || "webp",
    width: options?.width || 800,
    height: options?.height || 600,
  });
};

export const preloadUserAvatars = async (
  avatarPaths: (string | null | undefined)[],
  size: number = 200,
): Promise<void> => {
  const validPaths = avatarPaths.filter((path): path is string => !!path) as ImageType[];

  await preloadImages(validPaths, {
    quality: 70,
    format: "webp",
    width: size,
    height: size,
  });
};
