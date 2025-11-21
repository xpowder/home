import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface ServiceHeadingsProps {
  heading: string;
  onClick?: () => void; // optional callback
}

export default function ServiceHeadings({ heading, onClick }: ServiceHeadingsProps) {
  const t = useTranslations("services");
  return (
    <div
      aria-label={`${heading} Services Section`}
      className="flex w-full items-center justify-between md:px-5"
    >
      <h2 className={`font-roboto text-heading text-[clamp(16px,2vw,28px)] font-semibold`}>
        {heading}
      </h2>
      <button
        aria-label={`View All ${heading} Service`}
        onClick={onClick}
        className="text-primaryDark font-roboto flex items-center justify-center text-[clamp(12px,1vw,16px)] font-semibold hover:underline"
      >
        {t("sectionButton")}
        <ArrowRight className="ml-1 h-4 w-4 rtl:rotate-180" />
      </button>
    </div>
  );
}
