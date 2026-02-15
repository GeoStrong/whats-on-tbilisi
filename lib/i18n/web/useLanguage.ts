"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updatePreferredLanguage } from "@/lib/profile/profile";
import type { AppDispatch, RootState } from "@/lib/store/store";
import { userActions } from "@/lib/store/userSlice";
import {
  defaultLocale,
  normalizeLocale,
  supportedLocales,
} from "../config";
import type { AppLocale } from "../types";
import { persistLocale, resolveClientLocale } from "./persistence";

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const locale = useMemo(() => {
    return normalizeLocale(i18n.resolvedLanguage ?? i18n.language) ?? defaultLocale;
  }, [i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    const userLocale = normalizeLocale(user?.preferred_language ?? null);
    const storedLocale = resolveClientLocale();
    const targetLocale = userLocale ?? storedLocale ?? defaultLocale;

    if (locale !== targetLocale) {
      void i18n.changeLanguage(targetLocale);
    }

    persistLocale(targetLocale);
  }, [i18n, locale, user?.preferred_language]);

  const setLanguage = useCallback(
    async (nextLocale: AppLocale) => {
      if (nextLocale === locale) return;

      await i18n.changeLanguage(nextLocale);
      persistLocale(nextLocale);

      if (!user?.id) return;

      try {
        await updatePreferredLanguage(user.id, nextLocale);
        dispatch(userActions.setPreferredLanguage(nextLocale));
      } catch (error) {
        console.error("Failed to persist language preference", error);
      }
    },
    [dispatch, i18n, locale, user?.id],
  );

  return {
    locale,
    setLanguage,
    supportedLocales,
  };
};
