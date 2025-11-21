"use client";
import { useTranslations } from "next-intl";

import CtaButton from "@/components/shared/CtaButton";
import useComingSoonAlert from "@/hooks/useCommingSoonAlert";
import { sectionHeading, sectionParagraph } from "@/utils/fonts";

export default function Cta() {
  const showCommingSoon = useComingSoonAlert();
  const t = useTranslations("cta");
  return (
    <section
      className="bg-secondary w-full"
      role="region"
      aria-label="Call to action: book a home service or become a Provider"
    >
      <div className="container flex h-[350px] flex-col items-center justify-center px-5 md:h-[413px]">
        <div className="space-y-2 text-center">
          <h2 className={`${sectionHeading} text-heading text-center`}>{t("heading")}</h2>
          <p className={`${sectionParagraph} text-subtext text-center`}>{t("description")}</p>
        </div>

        <div className="xs:max-w-[300px] mt-6 flex w-full flex-col items-center justify-center gap-4 md:flex-row">
          <CtaButton text={t("BookService")} onclick={showCommingSoon} />

          <button
            type="button"
            onClick={showCommingSoon}
            aria-label="Become a Provider and Deliver Service"
            className={`font-poppins bg-primary shadow-background/10 hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled h-12 w-full cursor-pointer rounded-md text-[14px]  font-semibold leading-[140%] text-white shadow-md duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5] md:w-[215px] md:text-[18px]`}
          >
            {t("BecomeProvider")}
          </button>
        </div>
      </div>
    </section>
  );
}
