"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import authImag from "@/assets/auth/authImage.png";
import Hammer from "@/assets/home/hero/Hammer.svg";

export default function UserAuthDecor() {
  const t = useTranslations("auth.userDecorator");
  return (
    <div className="relative flex w-full max-w-[600px] items-center justify-center px-8">
      {/* Promotional Card */}
      <div className="relative w-full max-w-[500px] rounded-[40px] bg-white/10 backdrop-blur-sm p-6 sm:p-8 lg:p-10">
        {/* Content Container - Text and Image Side by Side */}
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          {/* Text Content */}
          <div className="relative z-10 flex-1 space-y-3 lg:space-y-4">
            <h2 className="font-poppins text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-white">
              {t("heading")}
            </h2>
            <p className="font-roboto text-sm sm:text-base lg:text-lg font-normal text-white/90">
              {t("paragraph")}
            </p>
          </div>

          {/* User Image - Positioned to the right */}
          <div className="relative h-[250px] w-full flex-shrink-0 sm:h-[280px] lg:h-[320px] lg:w-[200px]">
            <Image
              src={authImag}
              alt="User"
              fill
              sizes="(max-width: 1024px) 100vw, 200px"
              className="object-contain object-right"
              priority
            />
          </div>
        </div>

        {/* Icon Below - Centered */}
        <div className="mt-6 flex justify-center lg:mt-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white sm:h-16 sm:w-16">
            <Hammer className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
