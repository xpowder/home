"use client";
import { useTranslations } from "next-intl";

import Star from "@/assets/home/hero/star.svg";
import Support from "@/assets/home/hero/support.svg";
import VerifiedProfessionals from "@/assets/home/hero/verifiedProfessionals.svg"; //feature icon images

export default function HeroFeatures() {
  const t = useTranslations("hero.features");

  return (
    <div className="flex gap-5" aria-label="Highlighted features of our service">
      <div className="flex items-center justify-start gap-2" aria-label="Verified Professionals">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-xl bg-white sm:h-10 sm:w-10">
          <VerifiedProfessionals
            aria-label="Verified Professionals"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        </div>
        <span className={`font-poppins text-heading text-[clamp(11px,1vw,15px)]  font-normal  `}>
          {t("verifiedProfessionals")}
        </span>
      </div>
      <div className=" flex items-center justify-start gap-2" aria-label="24/7 Support">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-xl bg-white sm:h-10 sm:w-10">
          <Support aria-label="24/7 Support" width={16} height={16} className="h-4 w-4" />
        </div>
        <span className={`font-poppins text-heading text-[clamp(11px,1vw,15px)] font-normal `}>
          {t("support")}
        </span>
      </div>
      <div className="hidden items-center justify-start gap-2 lg:flex" aria-label="24/7 Support">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-xl  bg-white sm:h-10 sm:w-10">
          <Star aria-label="24/7 Support" width={16} height={16} className="h-4 w-4" />
        </div>
        <span className={`font-poppins text-heading text-[clamp(11px,1vw,15px)]  font-normal `}>
          {t("rating")}
        </span>
      </div>
    </div>
  );
}
