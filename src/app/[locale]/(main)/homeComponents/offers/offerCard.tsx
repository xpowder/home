"use client";
import Image from "next/image";

import useComingSoonAlert from "@/hooks/useCommingSoonAlert";
import { OfferListType } from "@/types/home/offerListType";
import { cardHeading, sectionParagraph } from "@/utils/fonts";

import { Card, CardContent, CardHeader } from "../../../../../components/ui/card";

export default function OfferCard({ image, heading, alt, paragraph }: OfferListType) {
  const showCommingSoon = useComingSoonAlert();
  return (
    // Card Component for Offer Section
    <div onClick={showCommingSoon}>
      <Card
        className="bg-background shadow-foreground/20 mx-auto h-[304px]  w-full max-w-[300px] rounded-2xl border-none p-0 shadow-sm duration-300 hover:scale-105"
        aria-label={`Offer card: ${heading}`}
        tabIndex={0} // make card focusable for keyboard users
      >
        <CardHeader className=" relative h-48 w-full max-w-[300px]  p-0">
          <Image
            src={image}
            alt={alt}
            height={192}
            width={300}
            className="h-48 w-full  max-w-[300px] rounded-t-2xl "
            priority
          />
        </CardHeader>
        <CardContent>
          {/* previous style `${poppins.className} font-semibold text-[min(20px,4vw)] leading-[28px]   text-[#071621] ` */}
          <h3 className={`${cardHeading} text-heading`}>{heading}</h3>
          {/* `${poppins.className} font-normal text-[min(16px,3vw)] leading-[28px]   text-[#1A5599] ` */}
          <p className={`${sectionParagraph} text-primary text-start`}>{paragraph}</p>
        </CardContent>
      </Card>
    </div>
  );
}
