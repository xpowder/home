import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

import { OfferList } from "@/utils/constants/homeData";

import SectionButton from "../../../../../components/shared/SectionButton";
import SectionHeaderWithDivider from "../../../../../components/shared/SectionHeaderWithDivider";
import OfferCard from "./offerCard";

export default async function Offers() {
  const t = await getTranslations("whatWeOffer");
  return (
    <section
      className="dark:bg-secondary w-full bg-[#F9FAFB]"
      aria-labelledby="offers-heading" // label the section for screen readers
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Offer Section Header */}
        <SectionHeaderWithDivider
          divider={true}
          heading={<span id="offers-heading">{t("heading")}</span>}
          description={<span>{t("description")}</span>}
        />

        {/* Offer Cards */}
        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {OfferList.map((item, idx) => (
            <OfferCard
              key={idx}
              image={item.image}
              heading={item.heading}
              paragraph={item.paragraph}
              alt={item.heading} // meaningful alt text for images
              aria-label={`Offer: ${item.heading}`} // screen reader friendly
            />
          ))}
        </div>

        {/* Offer section Action Button */}
        <div className="flex items-center justify-center pb-16 pt-8">
          <SectionButton
            bg="bg-primary"
            text={t("sectionButton")}
            icon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
            aria-label={t("sectionButton")}
          />
        </div>
      </div>
    </section>
  );
}
