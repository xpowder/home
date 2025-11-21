"use client";
import { useTranslations } from "next-intl";
import React from "react";

import Bell from "@/assets/providerDashboard/Bell.svg";
import Rocket from "@/assets/providerDashboard/Rocket.svg";
import { cardParagraph } from "@/utils/fonts";

export default function FeaturesCommingSoon() {
  const t = useTranslations("providersDashboard.featureCommingSoon");
  return (
    <section className="mt-8 px-5 md:mt-16">
      <div className="container">
        <div className="bg-secondary/80 shadow-foreground/20 md:py-15 flex h-full w-full flex-col items-center justify-center gap-5 rounded-2xl px-5 py-10 shadow-md">
          <div className="bg-primaryDark flex h-20 w-20 items-center justify-center rounded-full">
            <Rocket className="h-6 w-6 " />
          </div>
          <h2
            className={`font-roboto text-heading text-center text-[clamp(16px,2vw,36px)] font-semibold`}
          >
            {t("title")}
          </h2>
          <p className={`${cardParagraph} text-subtext text-center`}>
            {t("description1")} <br className="hidden md:block" /> {t("description2")}
          </p>
          <button
            className={`font-poppins bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn  disabled:bg-btnDisabled flex h-12  cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2 text-[clamp(12px,1vw,16px)]  font-medium text-white shadow-md shadow-black/10 duration-300 hover:-translate-y-px hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]`}
          >
            <Bell className="h-4 w-4" />
            {t("actionButton")}
          </button>
        </div>
      </div>
    </section>
  );
}
