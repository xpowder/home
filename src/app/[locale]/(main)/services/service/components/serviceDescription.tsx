"use client";
import { useTranslations } from "next-intl";
import React from "react";

import GreenRoundTick from "@/assets/services/GreenRoundTick.svg";
import GreenTick from "@/assets/services/GreenTick.svg";
import RedCross from "@/assets/services/RedCross.svg";
import RedRoundCross from "@/assets/services/RedRoundCross.svg";
import Toolbox from "@/assets/services/Toolbox.svg";

interface ServiceDescriptionProps {
  description: string;
  included: string[];
  notIncluded: string[];
  supplies: string[];
}

interface ServeData {
  data?: ServiceDescriptionProps;
}

const dummyData: ServiceDescriptionProps = {
  description:
    "Our deep home cleaning service provides a comprehensive cleaning solution for your entire home in Casablanca. We focus on all the details that regular cleaning might miss, ensuring your home is spotless from top to bottom.",
  included: [
    "Dusting furniture, floors, and corners",
    "Mopping and vacuuming",
    "Bathroom/kitchen sanitization",
    "Window cleaning",
    "Trash removal",
  ],
  notIncluded: ["Laundry or dishwashing", "Heavy lifting", "Carpet shampooing (add-on only)"],
  supplies: [
    "All cleaning tools and materials are provided by the cleaner",
    "We use eco-friendly, non-toxic solutions",
  ],
};

export default function ServiceDescription({ data }: ServeData) {
  const displayData = data || dummyData;
  const t = useTranslations("services.service");
  return (
    // Main container for service description
    <div
      className="pb-15 dark:bg-secondary rounded-xl bg-white p-5"
      role="region"
      aria-label="Service description section"
    >
      {/* Description section */}
      <div className="space-y-3">
        <h4
          className="font-inter text-heading text-[clamp(14px,1vw,20px)] font-semibold"
          id="service-description-heading"
        >
          {t("description")}
        </h4>
        <p
          className="font-roboto text-subtext text-[clamp(12px,1vw,16px)] font-normal"
          aria-describedby="service-description-heading"
        >
          {displayData.description}
        </p>
      </div>

      {/* Included and Not Included sections */}
      <div
        className="md:my-15 my-10 flex items-start justify-start gap-[3vw]"
        role="group"
        aria-label="Included and not included services"
      >
        {/* Included services */}
        <div className="space-y-4" role="region" aria-labelledby="included-heading">
          <h5
            className="font-roboto text-heading flex items-start gap-2 text-[clamp(12px,1vw,16px)] font-semibold"
            id="included-heading"
          >
            <GreenRoundTick className="h-5 w-5" role="img" aria-label="Green checkmark icon" />
            {t("included")}
          </h5>
          <ul className="space-y-2" aria-label="List of included services">
            {displayData.included.map((item, idx) => (
              <li
                key={idx}
                className="font-poppins text-subtext flex items-center justify-start gap-2 text-[clamp(12px,1vw,16px)] font-normal"
                role="listitem"
              >
                <GreenTick
                  className="h-[clamp(8px,1vw,16px)] min-h-2 w-[clamp(8px,1vw,16px)] min-w-2"
                  role="img"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Not included services */}
        <div className="space-y-4" role="region" aria-labelledby="not-included-heading">
          <h5
            className="font-roboto text-heading flex items-start gap-2 text-[clamp(12px,1vw,16px)] font-semibold"
            id="not-included-heading"
          >
            <RedRoundCross className="h-5 w-5" role="img" aria-label="Red cross icon" />
            {t("notIncluded")}
          </h5>
          <ul className="space-y-2" aria-label="List of not included services">
            {displayData.notIncluded.map((item, idx) => (
              <li
                key={idx}
                className="font-poppins text-subtext flex items-center justify-start gap-2 text-[clamp(12px,1vw,16px)] font-normal"
                role="listitem"
              >
                <RedCross
                  className="h-[clamp(8px,1vw,16px)] min-h-2 w-[clamp(8px,1vw,16px)] min-w-2"
                  role="img"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Supplies & Equipment section */}
      <div className="space-y-4" role="region" aria-labelledby="supplies-heading">
        <h5
          className="font-roboto text-heading flex items-center gap-2 text-[clamp(12px,1vw,16px)] font-semibold"
          id="supplies-heading"
        >
          <Toolbox className="h-5 w-5" role="img" aria-label="Toolbox icon" />
          {t("supplies")}
        </h5>
        <ul className="space-y-2" aria-label="Supplies and equipment list">
          {displayData.supplies.map((item, idx) => (
            <li
              key={idx}
              className="font-poppins text-subtext flex items-center justify-start gap-2 text-[clamp(12px,1vw,16px)] font-normal"
              role="listitem"
            >
              {/* Decorative bullet point */}
              <span
                className="min-w-.5 min-h-.5 bg-subtext h-[clamp(2px,1vw,4px)] w-[clamp(2px,1vw,4px)] rounded-full"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
