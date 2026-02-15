export const APP_LOCALES = ["en", "ka"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];
