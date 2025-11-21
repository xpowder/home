"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import Time from "@/assets/maintenance/Time.svg";
import CircleQuestionMark from "@/assets/notFound/CircleQuestionMark.svg";
import ErrorImage from "@/assets/notFound/errorHero.png";
import Home from "@/assets/notFound/Home.svg";
import Mail from "@/assets/notFound/Mail.svg";
import Message from "@/assets/notFound/Message.svg";
import Phone from "@/assets/notFound/Phone.svg";
import RotateCw from "@/assets/notFound/RotateCW.svg";
import Countdown from "@/components/shared/CountDown";
import { CountdownProps } from "@/components/shared/CountDown";
import { Button } from "@/components/ui/button";
import { cardParagraph, sectionHeading } from "@/utils/fonts";

export default function Maintenance({ time = "6:00:00", onComplete }: CountdownProps) {
  const router = useRouter();
  const t = useTranslations("status.maintenance");

  return (
    // Main wrapper with role="alert" so assistive tech knows it's important
    <section
      role="alert"
      aria-live="assertive"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F0FCFB] p-5"
    >
      {/* Main container with background overlay */}
      <div className="md:p-15 flex flex-col items-center justify-center rounded-2xl bg-white bg-[url('/notFound/notFoundOverlay.png')] bg-contain p-5 shadow-2xl shadow-black/25">
        {/* Hero image for visual context */}
        <Image
          src={ErrorImage}
          height={250}
          width={250}
          alt="Illustration representing scheduled maintenance downtime"
        />

        {/* Headline and short description */}
        <div className="space-y-5">
          <h2 className={`${sectionHeading} text-heading text-center`} id="maintenance-heading">
            {t("title")}
          </h2>
          <p
            className={`${cardParagraph} text-subtext text-center`}
            aria-describedby="maintenance-heading"
          >
            {t("description")}
          </p>
        </div>

        {/* Countdown timer */}
        <div className="mb-4 mt-6 space-y-3">
          <div className="font-roboto text-subtext flex items-center justify-center gap-4 text-[clamp(14px,1vw,16px)] font-semibold">
            <Time className="h-4 w-4" aria-hidden="true" />
            <span>{t("estimatedTime")}</span>
          </div>
          <div className="flex items-center justify-center" aria-live="polite">
            {/* Custom countdown component receives initial time as props */}
            <Countdown time={time} onComplete={onComplete} />
          </div>
        </div>

        {/* Action buttons: Retry and Return Home */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-center gap-5">
            <Button
              onClick={() => router.refresh()}
              aria-label="Retry loading the page"
              className="font-poppins bg-primaryDark hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-[40px] w-[100px] cursor-pointer items-center justify-center gap-2 rounded-lg text-[clamp(10px,1vw,12px)] font-semibold text-white duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5] md:w-[140px]"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              {t("retry")}
            </Button>

            <Button
              onClick={() => router.push("/")}
              aria-label="Return to Home Page"
              className="font-poppins flex h-[40px] w-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg border-[1px] border-[#E5E7EB] bg-white text-[clamp(10px,1vw,12px)] font-semibold text-[#1F2937] hover:translate-y-[-1px] hover:bg-[#F9FAFB] focus:ring-gray-300 active:bg-[#F3F4F6] disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] md:w-[160px]"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              {t("returnHome")}
            </Button>
          </div>

          {/* Helpful links for support */}
          <nav
            className="flex items-center justify-around gap-4"
            aria-label="Help and support links"
          >
            <a
              href="#support"
              className="font-poppins text-primary flex items-center justify-center gap-1 text-[clamp(10px,1vw,12px)] font-normal"
            >
              <Phone className="fill-primary h-[12px] w-[12px]" aria-hidden="true" />
              {t("contactSupport")}
            </a>
            <a
              href="#help"
              className="font-poppins text-primary flex items-center justify-center gap-1 text-[clamp(10px,1vw,12px)] font-normal"
            >
              <CircleQuestionMark className="fill-primary h-[12px] w-[12px]" aria-hidden="true" />
              {t("helpCenter")}
            </a>
            <a
              href="mailto:support@homezup.com"
              className="font-poppins text-primary flex items-center justify-center gap-1 text-[clamp(10px,1vw,12px)] font-normal"
            >
              <Mail className="h-[12px] w-[12px]" aria-hidden="true" />
              {t("emailUs")}
            </a>
          </nav>
        </div>
      </div>

      {/* Footer message */}
      <p className="font-poppins mt-5 text-center text-[clamp(10px,1vw,12px)] font-normal leading-[20px] text-[#6B7280]">
        {t("copyright")}
      </p>

      {/* Chat support card — purely informative */}
      <div
        className="absolute bottom-5 right-5 flex items-center justify-around gap-2 rounded-xl bg-white p-4 shadow-md"
        aria-live="polite"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#404040]">
          <Message className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <h4 className="font-roboto text-subtext text-[clamp(12px,1vw,14px)] font-semibold leading-[20px]">
            {t("chatSupport")}
          </h4>
          <p className="font-roboto text-subtext text-[clamp(10px,1vw,12px)] font-normal leading-[16px]">
            {t("help")}
          </p>
        </div>
      </div>
    </section>
  );
}
