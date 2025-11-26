import React from "react";

import ImageSection from "./imageSection";
import ServicePhotosSection from "./servicePhotosSection";

export default function PortfolioAndCredentials() {
  return (
    <section aria-label="Portfolio and Credentials Section" className="my-8 px-5 md:my-16">
      <div className="container space-y-8">
        <div role="region" aria-label="Portfolio Images" className="w-full">
          <ImageSection />
        </div>
        <div role="region" aria-label="Service Photos" className="w-full">
          <ServicePhotosSection />
        </div>
      </div>
    </section>
  );
}
