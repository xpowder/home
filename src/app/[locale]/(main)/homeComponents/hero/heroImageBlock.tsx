"use client";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";

import HeroImage from "@/assets/home/hero/heroImage2.png";

export default function HeroImageBlock() {
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(imageWrapperRef.current, {
      xPercent: 100,
      opcaity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  }, []);

  return (
    <div
      aria-label="Hero Image section for finding trusted home service providers"
      className="relative mx-auto flex h-full w-full items-center justify-start"
    >
      <div ref={imageWrapperRef} className="absolute bottom-0 z-10 h-[95%] w-[85%]">
        <Image src={HeroImage} alt="heroImage" className="h-full w-full" priority />
      </div>
    </div>
  );
}
