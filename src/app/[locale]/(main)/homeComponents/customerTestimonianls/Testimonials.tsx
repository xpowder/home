import { getTranslations } from "next-intl/server";
import React from "react";

import { sectionHeading } from "@/utils/fonts";

import SmoothTestimonialScroll from "./testimonialScroll";

export default async function Testimonials() {
  const t = await getTranslations("testimonials");
  return (
    <section
      role="region"
      aria-label="Wall Of Customer Success, Customer Testimonials"
      className=""
    >
      <div className="container py-16">
        <h2 className={`${sectionHeading} text-heading text-center`}>
          {t("headingStart")} <span className="text-supporting">{t("headingEnd")}</span>
        </h2>
        <div aria-label="Scrolling list of customer testimonials" className="mt-8">
          <SmoothTestimonialScroll />
        </div>
      </div>
    </section>
  );
}
