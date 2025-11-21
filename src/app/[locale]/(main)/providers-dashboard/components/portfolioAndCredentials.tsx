import React from "react";

import ImageSection from "./imageSection";

export default function PortfolioAndCredentials() {
  return (
    <section aria-label="Portfolio and Credentials Section" className="my-8 px-5 md:my-16">
      <div className="container">
        <div role="region" aria-label="Portfolio and Recent Messages Grid" className="w-full gap-5">
          <ImageSection />
        </div>
      </div>
    </section>
  );
}
