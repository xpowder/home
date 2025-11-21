"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import ProviderAuthImage from "@/assets/auth/providerAuthImage.png";
import Hammer from "@/assets/home/hero/Hammer.svg";

export default function ProviderAuthDecor() {
  const t = useTranslations("auth.providerDecorator");
  return (
    <div className="relative aspect-[.8] w-[70%] min-w-[340px]  max-w-[500px] overflow-visible rounded-[60px] border border-white/20 bg-white/20">
      <div className="absolute left-[-30px] right-auto top-[70%]  flex h-16 w-16 items-center justify-center rounded-full bg-white rtl:left-auto rtl:right-[-30px]">
        <Hammer className="h-8 w-8" />
      </div>

      <Image
        src={ProviderAuthImage}
        alt="authImage"
        fill
        className="ml-[15%] mr-0 object-contain rtl:ml-0 rtl:mr-[15%] rtl:scale-x-[-1]"
      />

      <div className="relative z-10 space-y-2 p-10">
        <h2 className="font-poppins w-[60%] text-[calc(12px+1vw)] font-bold text-white">
          {t("heading")}
        </h2>
        <p className="font-roboto w-[50%] text-[calc(10px+0.5vw)] font-normal text-white">
          {t("paragraph")}
        </p>
      </div>
    </div>
  );
}
