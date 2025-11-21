"use client";
import { X } from "lucide-react";
import { MessageCircleMoreIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import Globe from "@/assets/footer/globeWhite.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // shadcn/ui example
import { useLanguage } from "@/store/LanguageContext";
import { footerLinks } from "@/utils/constants/homeData";
import { poppins, roboto } from "@/utils/fonts";

import SocialIcons from "../../shared/SocialIcons";
import FooterLinksSection from "./footerLinkSection";

export default function Footer() {
  const [showMessage, setShowMessage] = useState(true);
  const { language, setLanguage } = useLanguage();
  const t = useTranslations();
  return (
    <footer className="bg-primary text-white" aria-label="Site footer">
      <div
        className="container relative flex flex-col gap-8 px-4 py-12 md:flex-row md:gap-16"
        aria-label="Footer main content"
      >
        {/* Branding & Social */}
        <div
          className="flex flex-col items-center space-y-4 text-center  md:items-start md:text-start "
          aria-label="Branding and social links"
        >
          <h3 className={`${poppins.className} text-xl font-bold leading-6`}>Homezup</h3>
          <p className={`${roboto.className} max-w-[280px] text-sm font-normal leading-6`}>
            {t("footer.tagline")}
          </p>
          <SocialIcons aria-label="Follow us on social media" />
        </div>

        {/* Footer Links Grid */}
        <div
          className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
          aria-label="Footer navigation links"
        >
          {footerLinks.map((section) => (
            <FooterLinksSection
              key={section.titleKey}
              titleKey={section.titleKey}
              links={section.links}
            />
          ))}
        </div>

        {/* Floating help box – now sticky on mobile */}
        <div
          className="md:right-15 rtl:md:left-15 fixed bottom-6 left-auto right-6 z-20 flex space-x-2 md:absolute md:left-auto md:top-1  rtl:left-6  rtl:right-auto rtl:md:right-auto"
          aria-label="Help and chat buttons"
        >
          <span
            className={`${roboto.className} font-normal ${showMessage ? "opacity-100" : "opacity-0"} flex h-12 w-[200px] items-center justify-between gap-5 rounded-md bg-white px-3 py-2 text-xs text-[#4B4B4B] shadow-sm shadow-black/10 md:w-[280px] md:text-base`}
          >
            {t("footer.helpMessage")}
            <button
              type="button"
              onClick={() => setShowMessage(false)}
              aria-label="Close help message"
              className="cursor-pointer p-1 hover:opacity-70 focus:outline-none"
            >
              <X className="h-4 w-4 " aria-hidden="true" />
            </button>
          </span>
          <button
            type="button"
            onClick={() => setShowMessage(true)}
            aria-label="Open live support chat"
            className="text-background bg-foreground shadow-background/10 flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition hover:scale-105"
          >
            <MessageCircleMoreIcon
              width={128}
              height={128}
              className="text-foreground fill-background h-6 w-6 cursor-pointer"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto mb-4 h-px max-w-[1440px] bg-white" aria-hidden="true" />

      {/* Bottom row */}
      <div
        className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-4 pb-2 md:flex-row"
        aria-label="Footer bottom bar"
      >
        <p className={`${roboto.className} text-xs font-normal leading-6 md:text-sm`}>
          {t("footer.copyright")}
        </p>

        {/* Language dropdown*/}
        <div className="">
          <Select
            value={language === "english" ? "en" : language === "arabic" ? "ar-MA" : "fr"} // bind context value
            onValueChange={
              (val) => setLanguage(val === "en" ? "english" : val === "ar-MA" ? "arabic" : "french") // update context
            }
            aria-label="Select site language"
          >
            <SelectTrigger
              aria-label={language}
              className=" flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-white shadow-none focus-visible:ring-0"
            >
              <Globe width={16} height={16} className="h-4 w-4" aria-hidden="true" />
              <SelectValue
                placeholder="Language"
                className={`${poppins.className} text-[clamp(15px,16px,17px)]`}
              />
            </SelectTrigger>
            <SelectContent className="rounded-md border border-gray-200 bg-black/50 text-white shadow-lg">
              <SelectItem
                value="en"
                aria-label="English language"
                className="hover:bg-foreground/10 cursor-pointer"
              >
                English
              </SelectItem>
              <SelectItem
                value="ar-MA"
                aria-label="Arabic language "
                className="hover:bg-foreground/10 cursor-pointer"
              >
                Arabic
              </SelectItem>
              <SelectItem
                value="fr"
                aria-label="French language "
                className="hover:bg-foreground/10 cursor-pointer"
              >
                French
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </footer>
  );
}
