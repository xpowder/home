"use client";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import Tick from "@/assets/auth/Tick.svg";
import { cardHeading, cardParagraph } from "@/utils/fonts";

export default function Page() {
  const t = useTranslations("auth.verificationSuccessful");
  return (
    <section
      className="dark:bg-secondary flex min-h-screen w-full items-center justify-center bg-white"
      role="main"
      aria-label={t("ariaMainLabel")}
    >
      {/* Left Panel: Success Message */}
      <div className="dark:bg-secondary flex flex-col items-center justify-center gap-4 bg-white p-5">
        <div
          className="bg-background flex max-w-[400px] flex-col items-center justify-center gap-3 rounded-xl p-10 text-center shadow-md shadow-black/20"
          role="region"
          aria-labelledby="success-title"
          aria-describedby="success-desc"
        >
          {/* Success Icon */}
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DCFCE7]"
            aria-hidden="true"
          >
            <Tick className="h-4 w-4" />
          </div>

          {/* Heading */}
          <h2 id="success-title" className={`${cardHeading} text-heading`} tabIndex={0}>
            {t("title")}
          </h2>

          {/* Description */}
          <p id="success-desc" className={`${cardParagraph} text-subtext`} tabIndex={0}>
            {t("description")}
          </p>

          {/* Navigate to Login */}
          <button
            onClick={() => redirect("/auth")}
            type="button"
            className="bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-[14px] text-white duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
          >
            {t("goToLogin")}
          </button>

          {/* Extra Info */}
          <p className={`${cardParagraph} text-subtext`} tabIndex={0}>
            {t("return")}
          </p>
        </div>
      </div>

      {/* Right Panel: Decorative */}
      {/* <div
        className='hidden md:flex bg-primary w-full h-full items-center justify-center overflow-hidden'
        role="presentation"
        aria-hidden="true"
      >
        <ProviderAuthDecor />
      </div> */}
    </section>
  );
}
