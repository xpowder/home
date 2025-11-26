import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { heroHeading, heroParagraph } from "@/utils/fonts";

import HeroFeatures from "./heroFeatures";
import HeroSearch from "./heroSearch";

export default function HeroTexts() {
  const t = useTranslations("hero");
  const textDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textDivRef.current) {
      const children = textDivRef.current.children;
      gsap.from(children, {
        y: 50,
        opacity: 0,
        duration: 2,
        stagger: 0.3, // stagger each child by 0.3s
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <div
      ref={textDivRef}
      className="z-13 flex max-h-[80vh] w-full flex-col items-center justify-center px-4 py-6 text-center sm:px-6 sm:py-8 md:items-start md:px-8 md:text-start lg:pl-[10%]"
      aria-label="Hero section for finding trusted home service providers"
    >
      <h1 className={`${heroHeading} text-heading mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl`}>{t("heading")}</h1>

      <p className={`${heroParagraph} text-subtext mb-6 text-sm sm:text-base md:text-lg`}>{t("paragraph")}</p>

      {/* Search Box */}
      <HeroSearch />

      {/* Feature Icons */}
      <div className="mt-12 sm:mt-16 md:mt-20">
        <HeroFeatures />
      </div>
    </div>
  );
}
