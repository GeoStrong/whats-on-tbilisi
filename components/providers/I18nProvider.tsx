"use client";

import React, { useEffect, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { defaultLocale, normalizeLocale } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/init";
import { persistLocale } from "@/lib/i18n/web/persistence";

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale?: string | null;
}

const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLocale,
}) => {
  const locale = normalizeLocale(initialLocale) ?? defaultLocale;
  const i18n = useMemo(() => getI18n(locale), [locale]);

  useEffect(() => {
    persistLocale(locale);
    if ((i18n.resolvedLanguage ?? i18n.language) !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
