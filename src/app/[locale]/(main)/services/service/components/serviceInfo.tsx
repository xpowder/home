import React from "react";

import DescriptionAndReview from "./descriptionAndReview";
import ServiceProviderInformation from "./serviceProviderInformation";
import { Provider } from "@/services/provider.services";

interface ServiceInfoProps {
  provider?: Provider;
}

export default function ServiceInfo({ provider }: ServiceInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[74%_25%]">
      <DescriptionAndReview provider={provider} />
      <ServiceProviderInformation provider={provider} />
    </div>
  );
}
