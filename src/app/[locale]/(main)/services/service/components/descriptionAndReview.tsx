import React from "react";

import ServiceDescription from "./serviceDescription";
import WhatOthersSay from "./whatOthersSay";
import { Provider } from "@/services/provider.services";

interface DescriptionAndReviewProps {
  provider?: Provider;
}

export default function DescriptionAndReview({ provider }: DescriptionAndReviewProps) {
  const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en";
  
  const descriptionData = {
    description: provider?.bio || "Professional service provider with years of experience.",
    included: [
      "Professional service delivery",
      "Quality assurance",
      "Timely completion",
    ],
    notIncluded: ["Materials not specified", "Additional services not mentioned"],
    supplies: [
      "All necessary tools and equipment provided",
      "Professional-grade materials used",
    ],
  };

  return (
    <div className="space-y-10">
      <ServiceDescription data={descriptionData} />
      <WhatOthersSay providerId={provider?.id} />
    </div>
  );
}
