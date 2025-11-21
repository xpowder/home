import { getTranslations } from "next-intl/server";
import React from "react";

import SectionHeaderWithDivider from "../../../../../components/shared/SectionHeaderWithDivider";
import SmoothAutoScroll from "./smoothAutoScroll";

export default async function BrowseByNeed() {
  const t = await getTranslations("browseByNeed");
  return (
    <section className="" role="region" aria-labelledby={t("sectionAria")}>
      <div className="container pb-14">
        {/* Offer Section Header */}
        <SectionHeaderWithDivider
          heading={<span id="offers-heading">{t("heading")}</span>}
          description={<span>{t("description")}</span>}
        />
        <div className="mt-8 w-full">
          <SmoothAutoScroll />
        </div>
      </div>
    </section>
  );
}
