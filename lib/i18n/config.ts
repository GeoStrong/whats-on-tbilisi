import { APP_LOCALES, type AppLocale } from "./types";

export const supportedLocales = APP_LOCALES;
export const defaultLocale: AppLocale = "en";

export const localeCookieName = "wt_locale";
export const localeStorageKey = "wt_locale";

export const localeToLanguageTag: Record<AppLocale, string> = {
  en: "en-US",
  ka: "ka-GE",
};

export const isAppLocale = (value: unknown): value is AppLocale => {
  return (
    typeof value === "string" &&
    (supportedLocales as readonly string[]).includes(value)
  );
};

export const normalizeLocale = (
  value: string | null | undefined,
): AppLocale | null => {
  if (!value) return null;

  const normalized = value.toLowerCase();
  if (isAppLocale(normalized)) return normalized;

  const baseLocale = normalized.split("-")[0];
  return isAppLocale(baseLocale) ? baseLocale : null;
};
