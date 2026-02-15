import i18next, { type InitOptions, type i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLocale, supportedLocales } from "./config";
import { defaultNamespace, resources } from "./resources";
import type { AppLocale } from "./types";

let i18nInstance: i18n | null = null;

export const buildI18nOptions = (
  locale: AppLocale = defaultLocale,
): InitOptions => {
  return {
    resources,
    lng: locale,
    fallbackLng: defaultLocale,
    supportedLngs: [...supportedLocales],
    ns: Object.keys(resources.en),
    defaultNS: defaultNamespace,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    initImmediate: false,
    returnNull: false,
  };
};

export const getI18n = (locale: AppLocale = defaultLocale): i18n => {
  if (i18nInstance) {
    if (i18nInstance.resolvedLanguage !== locale) {
      void i18nInstance.changeLanguage(locale);
    }
    return i18nInstance;
  }

  const instance = i18next.createInstance();
  void instance.use(initReactI18next).init(buildI18nOptions(locale));
  i18nInstance = instance;
  return instance;
};
