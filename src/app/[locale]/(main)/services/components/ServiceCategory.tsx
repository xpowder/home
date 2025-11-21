import React from "react";

import LatestOfferCard from "@/components/shared/LatestOfferCard";
import { latestOfferData } from "@/utils/constants/homeData";

import ServiceHeadings from "./ServiceHeadings";

interface ServiceCategoryProps {
  heading: string;
}

export default function ServiceCategory({ heading }: ServiceCategoryProps) {
  return (
    <div aria-label={`${heading} Service Section`}>
      <ServiceHeadings heading={heading} />
      <div
        className="scrollbar-hide scale- flex h-full w-full items-center justify-around gap-5 overflow-x-scroll p-5"
        role="list"
        aria-label={`${heading} Service List`}
      >
        {latestOfferData.map((data, idx) => (
          <div role="listitem" key={idx}>
            <LatestOfferCard data={data} />
          </div>
        ))}
      </div>
    </div>
  );
}
