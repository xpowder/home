"use client";
import { useTranslations } from "next-intl";
import React from "react";

import Logo from "@/assets/loading/compressedLogo.svg";
import { sectionHeading, sectionParagraph } from "@/utils/fonts";
export default function LoadingPage() {
  const t = useTranslations("status.loading");
  return (
    // Wrapper with role="status" so screen readers announce this loading state
    <section
      role="status"
      aria-live="polite"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F0FCFB]"
    >
      {/* Animated logos (decorative) */}
      <div className="float-animation">
        <Logo className="h-16 w-16" />
      </div>

      {/* Loading messages (announced by screen readers) */}
      <div className="space-y-5">
        <h2 className={`${sectionHeading} text-subtext text-center`} id="loading-heading">
          {t("title")}
        </h2>
        <p
          className={`${sectionParagraph} text-subtext text-center`}
          aria-describedby="loading-heading"
        >
          {t("description")}
        </p>
      </div>

      {/* Decorative progress bar placeholder at bottom */}
      <div className="w-50 bg-primary absolute bottom-10 h-1 rounded-full" aria-hidden="true" />
    </section>
  );
}
