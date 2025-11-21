"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import ErrorSign from "@/assets/notFound/error.svg";
import ErrorImage from "@/assets/notFound/errorHero.png";
import RotateCw from "@/assets/notFound/RotateCW.svg";
import { Button } from "@/components/ui/button";
import { cardParagraph, sectionHeading } from "@/utils/fonts";

interface ErrorPageProps {
  onRetry?: () => void; // optional retry handler
  message?: string; // optional custom error message
}

export default function ErrorPage({ onRetry, message }: ErrorPageProps) {
  const router = useRouter();
  const t = useTranslations("status.errorPage");

  return (
    <section
      role="alert"
      aria-live="assertive"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F0FCFB] p-5"
    >
      <div className="md:p-15 flex flex-col items-center justify-center rounded-2xl bg-white bg-[url('/notFound/notFoundOverlay.png')] bg-contain p-5 shadow-2xl shadow-black/25">
        <Image
          src={ErrorImage}
          height={250}
          width={250}
          alt="Illustration representing a server error"
        />

        <div className="space-y-5">
          <div
            className="font-poppins max-w-50 mx-auto flex h-10 items-center justify-center gap-1 rounded-full bg-[#FEE2E2] text-[clamp(12px,1vw,14px)] font-semibold text-[#B91C1C]"
            role="status"
          >
            <ErrorSign className="h-[12px] w-[12px]" aria-hidden="true" />
            {t("statusCode")}
          </div>

          <h2 className={`${sectionHeading} text-heading text-center`} id="error-heading">
            {message || t("defaultHeading")}
          </h2>
          <p
            className={`${cardParagraph} text-subtext text-center`}
            aria-describedby="error-heading"
          >
            {t("description")}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-5">
          {onRetry && (
            <Button
              onClick={onRetry}
              aria-label="Retry loading this section"
              className="font-poppins bg-primaryDark hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn flex h-[40px] w-[120px] items-center justify-center gap-2 rounded-lg text-white"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              {t("retry")}
            </Button>
          )}

          <Button
            onClick={() => router.push("/")}
            aria-label="Return to Home Page"
            className="font-poppins border-1 flex h-[40px] w-[140px] items-center justify-center gap-2 rounded-lg border-[#FBB6B6] bg-transparent text-[#FF5E5E]"
          >
            {t("home")}
          </Button>
        </div>
      </div>
    </section>
  );
}
