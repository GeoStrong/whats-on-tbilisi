import {
  defaultLocale,
  localeToLanguageTag,
  normalizeLocale,
} from "./config";
import type { AppLocale } from "./types";

export const toLanguageTag = (
  locale: string | AppLocale | null | undefined,
): string => {
  const normalized = normalizeLocale(locale) ?? defaultLocale;
  return localeToLanguageTag[normalized];
};

export const formatDate = (
  value: string | number | Date,
  locale: string | AppLocale = defaultLocale,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string => {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "";

  return new Intl.DateTimeFormat(toLanguageTag(locale), options).format(
    dateValue,
  );
};
