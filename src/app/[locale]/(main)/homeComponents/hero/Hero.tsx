"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import HeroImageBlock from "./heroImageBlock";
import HeroTexts from "./heroTexts";

export default function Hero() {
  const { locale } = useParams();

  const [mounted, setMounted] = useState(false);

  // ✅ Wait until component is mounted before rendering children
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="Hero"
      className="bg-secondary relative max-h-[700px] min-h-[400px] w-full overflow-hidden md:h-[60vh]"
      role="region"
      aria-label="Hero section"
    >
      <div
        style={{ opacity: mounted ? 1 : 0 }}
        className={`container grid grid-cols-1  ${locale === "fr" ? "md:grid-cols-[70%_30%] lg:grid-cols-[60%_40%]" : "md:grid-cols-[60%_40%] lg:grid-cols-[50%_50%]"} h-full w-full`}
      >
        {/* Left text column */}
        <div
          className="z-20 flex items-center justify-center px-0 md:px-4"
          role="region"
          aria-label="Hero text content"
        >
          <HeroTexts />
        </div>

        {/* Right image column */}
        <div
          className={`relative hidden  w-full items-center  justify-start md:flex`}
          role="region"
          aria-label="Hero image"
        >
          <HeroImageBlock />
        </div>
      </div>
    </section>
  );
}
