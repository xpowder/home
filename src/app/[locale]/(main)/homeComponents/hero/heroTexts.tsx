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
      className="z-13 my-5 flex max-h-[80vh] w-full flex-col items-center justify-center p-[5%] text-center md:items-start  md:pl-[10%]  md:text-start"
      aria-label="Hero section for finding trusted home service providers"
    >
      <h1 className={`${heroHeading} text-heading mb-5`}>{t("heading")}</h1>

      <p className={`${heroParagraph} text-subtext mb-5`}>{t("paragraph")}</p>

      {/* Search Box */}
      <HeroSearch />

      {/* Feature Icons */}
      <div className="mt-20">
        <HeroFeatures />
      </div>
    </div>
  );
}
