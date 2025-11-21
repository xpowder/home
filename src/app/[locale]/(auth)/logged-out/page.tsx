"use client";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import { sectionHeading, sectionParagraph } from "@/utils/fonts";

export default function Page() {
  const t = useTranslations("auth.loggedOut");
  return (
    <section
      className="bg-secondary flex min-h-screen w-full items-center justify-center "
      role="main"
      aria-label={t("ariaMainLabel")}
    >
      {/* Left Panel: Success Message */}
      <div className="bg-secondary flex flex-col items-center justify-center gap-4 p-5">
        <div
          className="bg-background flex max-w-[500px] flex-col items-center justify-center gap-6 rounded-xl p-10 text-center shadow-md shadow-black/20"
          role="region"
          aria-labelledby="success-title"
          aria-describedby="success-desc"
        >
          {/* Heading */}
          <h2 id="success-title" className={`${sectionHeading} text-heading`} tabIndex={0}>
            {t("title")}
          </h2>

          {/* Description */}
          <p id="success-desc" className={`${sectionParagraph} text-subtext`} tabIndex={0}>
            {t("description")}
          </p>

          {/* Navigate to Login */}
          <button
            onClick={() => redirect("/auth")}
            type="button"
            className="bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-[14px] text-white duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
          >
            {t("goToLogin")}
          </button>
        </div>
      </div>
    </section>
  );
}
