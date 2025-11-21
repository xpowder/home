"use client";
import { useTranslations } from "next-intl";

import ArrowRight from "@/assets/home/hhw/ArrowRight.svg";
import SectionHeaderWithDivider from "@/components/shared/SectionHeaderWithDivider";

import HhwCard from "./hhwCard";

const hhwSteps = [{ key: "step1" }, { key: "step2" }, { key: "step3" }];

export default function HHW() {
  const t = useTranslations("hhw");
  return (
    <section role="region" aria-label={t("section.ariaLabel")} className="">
      <div className="container px-5 pb-16">
        {/* Main section heading */}
        <SectionHeaderWithDivider
          heading={<span id="latest-offers-heading">{t("section.heading")}</span>}
          description={t("section.description")}
        />
        <div className="flex w-full flex-col items-center justify-between lg:flex-row">
          {hhwSteps.map((item, index) => (
            <div
              key={index}
              aria-label={t(`steps.${item.key}.ariaLabel`)}
              className="flex w-full flex-col items-center justify-around lg:flex-row"
            >
              <HhwCard
                step={t(`steps.${item.key}.step`)}
                title={t(`steps.${item.key}.title`)}
                description={t(`steps.${item.key}.description`)}
              />
              {index !== 2 && (
                <ArrowRight className="h-6 w-6 rotate-90 lg:rotate-0 lg:rtl:rotate-180" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
