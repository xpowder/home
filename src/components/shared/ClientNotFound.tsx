"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import CircleQuestionMark from "@/assets/notFound/CircleQuestionMark.svg";
import ErrorImage from "@/assets/notFound/errorHero.png";
import Home from "@/assets/notFound/Home.svg";
import Mail from "@/assets/notFound/Mail.svg";
import Message from "@/assets/notFound/Message.svg";
import Phone from "@/assets/notFound/Phone.svg";
import RotateCw from "@/assets/notFound/RotateCW.svg";
import { Button } from "@/components/ui/button";
import { cardHeading } from "@/utils/fonts";

export default function ClientNotFound() {
  const router = useRouter();
  const t = useTranslations("status.notFound");

  return (
    // Wrapper section with role="alert" to notify assistive tech about error
    <section
      role="alert"
      aria-live="assertive"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F0FCFB] p-5"
    >
      {/* Main error container with background overlay */}
      <div className="md:p-15 flex flex-col items-center justify-center rounded-2xl bg-white bg-[url('/notFound/notFoundOverlay.png')] bg-contain p-5 shadow-2xl shadow-black/25">
        {/* Error hero image with descriptive alt */}
        <Image
          src={ErrorImage}
          height={250}
          width={250}
          alt="Illustration representing a server error"
        />

        <div className="mt-6 space-y-10">
          <h2 className={`${cardHeading} text-heading text-center`} id="error-heading">
            {t("title")}
          </h2>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-5">
            {/* Retry button */}
            <Button
              onClick={() => router.refresh()}
              aria-label="Retry loading this page"
              className="font-poppins bg-primaryDark hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-[40px] w-[100px] cursor-pointer items-center justify-center gap-2 rounded-lg text-[clamp(10px,1vw,12px)] font-semibold text-white duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5] md:w-[140px]"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              {t("retry")}
            </Button>

            {/* Home button */}
            <Button
              onClick={() => router.push("/")}
              aria-label="Return to Home Page"
              className="font-poppins flex h-[40px] w-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg border-[1px] border-[#E5E7EB] bg-white text-[clamp(10px,1vw,12px)] font-semibold text-[#1F2937] hover:translate-y-[-1px] hover:bg-[#F9FAFB] focus:ring-gray-300 active:bg-[#F3F4F6] disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] md:w-[160px]"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              {t("returnHome")}
            </Button>
          </div>

          {/* Quick links (support/help/email) */}
          <div
            className="flex items-center justify-around gap-4"
            aria-label="Error help and support links"
          >
            <div className="font-poppins text-primary flex cursor-pointer items-center justify-center gap-1 text-[clamp(10px,1vw,12px)] font-normal">
              <Phone className="fill-primary h-[12px] w-[12px]" aria-hidden="true" />
              {t("contactSupport")}
            </div>
            <div className="font-poppins text-primary flex cursor-pointer items-center justify-center gap-1 text-[clamp(10px,1vw,12px)] font-normal">
              <CircleQuestionMark className="fill-primary h-[12px] w-[12px]" aria-hidden="true" />
              {t("helpCenter")}
            </div>
            <div className="font-poppins text-primary flex cursor-pointer items-center justify-center gap-1 text-[clamp(10px,1vw,12px)] font-normal">
              <Mail className="h-[12px] w-[12px]" aria-hidden="true" />
              {t("emailUs")}
            </div>
          </div>
        </div>
      </div>

      {/* Footer message */}
      <p className="font-poppins mt-5 text-center text-[clamp(10px,1vw,12px)] font-normal leading-5 text-[#6B7280]">
        {t("copyright")}
      </p>

      {/* Chat support card (decorative placeholder for now) */}
      <div
        className="absolute bottom-5 right-5 flex items-center justify-around gap-2 rounded-xl bg-white p-4 shadow-md"
        aria-live="polite"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#404040]">
          <Message className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <h4 className="font-roboto text-subtext text-[clamp(12px,1vw,14px)] font-semibold leading-5">
            {t("chatSupport")}
          </h4>
          <p className="font-roboto text-subtext text-[clamp(10px,1vw,12px)] font-normal leading-4">
            {t("help")}
          </p>
        </div>
      </div>
    </section>
  );
}
