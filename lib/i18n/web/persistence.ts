import {
  defaultLocale,
  localeCookieName,
  localeStorageKey,
  normalizeLocale,
} from "../config";
import type { AppLocale } from "../types";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const parseLocaleFromCookieString = (cookieString: string): AppLocale | null => {
  const parts = cookieString.split(";").map((part) => part.trim());
  const localeCookie = parts.find((part) =>
    part.startsWith(`${localeCookieName}=`),
  );

  if (!localeCookie) return null;

  const [, rawValue = ""] = localeCookie.split("=");
  return normalizeLocale(decodeURIComponent(rawValue));
};

export const getLocaleFromCookie = (cookieString?: string): AppLocale | null => {
  if (typeof cookieString === "string") {
    return parseLocaleFromCookieString(cookieString);
  }

  if (typeof document === "undefined") return null;
  return parseLocaleFromCookieString(document.cookie);
};

export const getLocaleFromStorage = (): AppLocale | null => {
  if (typeof window === "undefined") return null;
  return normalizeLocale(window.localStorage.getItem(localeStorageKey));
};

export const persistLocale = (locale: AppLocale): void => {
  if (typeof document !== "undefined") {
    document.cookie = `${localeCookieName}=${encodeURIComponent(locale)}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
    document.documentElement.lang = locale;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(localeStorageKey, locale);
  }
};

export const resolveClientLocale = (): AppLocale => {
  return getLocaleFromStorage() ?? getLocaleFromCookie() ?? defaultLocale;
};
