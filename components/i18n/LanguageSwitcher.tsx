"use client";

import React from "react";
import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/web/useLanguage";
import { useTranslation } from "react-i18next";
import georgianFlagImg from "@/public/images/georgian-flag.png";
import englishFlagImg from "@/public/images/english-flag.png";
import Image from "next/image";

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  compact = false,
  className,
  align = "end",
}) => {
  const { t } = useTranslation(["common"]);
  const { locale, setLanguage, supportedLocales } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          className={cn(
            "gap-2",
            compact ? "w-16 justify-center px-2" : "justify-start",
            className,
          )}
          aria-label={t("common:language.switch")}
        >
          {/* <Globe2 className="h-4 w-4" /> */}
          {locale === "en" ? (
            <Image
              src={englishFlagImg.src}
              alt={t("common:language.english")}
              className="h-4 w-4 rounded-sm"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src={georgianFlagImg.src}
              alt={t("common:language.georgian")}
              className="h-4 w-4 rounded-sm"
              width={20}
              height={20}
            />
          )}
          {t(`common:language.short.${locale}`)}
          {/* {compact
            ? t(`common:language.short.${locale}`)
            : `${t("common:language.label")}: ${t(`common:language.short.${locale}`)}`} */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {supportedLocales.map((supportedLocale) => {
          const selected = supportedLocale === locale;
          return (
            <DropdownMenuItem
              key={supportedLocale}
              className="flex cursor-pointer items-center justify-between"
              onClick={() => void setLanguage(supportedLocale)}
            >
              {supportedLocale === "en" ? (
                <span className="flex items-center gap-1">
                  <Image
                    src={englishFlagImg.src}
                    alt={t("common:language.english")}
                    className="h-4 w-4 rounded-sm"
                    width={20}
                    height={20}
                  />
                  {t("common:language.english")}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Image
                    src={georgianFlagImg.src}
                    alt={t("common:language.georgian")}
                    className="h-4 w-4 rounded-sm"
                    width={20}
                    height={20}
                  />
                  {t("common:language.georgian")}
                </span>
              )}
              {selected && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
