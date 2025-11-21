import React from "react";

import ServiceCategory from "./ServiceCategory";

const sections: string[] = [
  "Home Maintenance",
  "Cleaning",
  "Construction & Renovation",
  "Other Popular Services",
];

export default function ServiceList() {
  return (
    <div className="space-y-5" aria-label="Service By Category Section">
      {sections.map((heading, idx) => (
        <ServiceCategory key={idx} heading={heading} />
      ))}
    </div>
  );
}
