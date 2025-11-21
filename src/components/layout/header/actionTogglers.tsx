import { useTranslations } from "next-intl";
import React from "react";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/store/LanguageContext";
export default function ActionTogglers() {
  const t = useTranslations("header");
  const { language, setLanguage } = useLanguage();
  const selectedLang = language
    ? language === "english"
      ? "en"
      : language === "arabic"
        ? "ar"
        : "fr"
    : "en"; // fallback to EN
  return (
    <div className="ml-0 mr-4 flex w-full items-center gap-4 sm:mr-6 sm:gap-6 xl:mx-0 xl:w-auto xl:gap-6 rtl:ml-4 rtl:mr-0 rtl:xl:ml-0">
      <Select
        value={selectedLang}
        onValueChange={(val) =>
          setLanguage(val === "en" ? "english" : val === "ar" ? "arabic" : "french")
        }
        aria-label={t("language")}
      >
        <SelectTrigger
          aria-label={t("language")}
          className="text-foreground bg-background flex max-h-8 cursor-pointer items-center gap-1 border border-gray-300 px-2 focus-visible:ring-0 xl:h-16"
        >
          <SelectValue placeholder={"EN"} className="font-poppins text-[clamp(15px,16px,17px)]" />
        </SelectTrigger>
        <SelectContent className="bg-background text-heading border-background/20 rounded-md border shadow-lg">
          <SelectItem value="en" className="hover:bg-foreground/10 cursor-pointer">
            EN
          </SelectItem>
          <SelectItem value="fr" className="hover:bg-foreground/10 cursor-pointer">
            FR
          </SelectItem>
          <SelectItem value="ar" className="hover:bg-foreground/10 cursor-pointer">
            AR
          </SelectItem>
        </SelectContent>
      </Select>
      <ThemeToggle />
    </div>
  );
}
