"use client";
import Image from "next/image";

import Star from "@/assets/home/offers/Star.svg";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cardParagraph } from "@/utils/fonts";

export default function TestimonialCard({
  message,
  name,
  img,
}: {
  message: string;
  name: string;
  img: string;
}) {
  return (
    <Card
      role="group"
      aria-label={`Testimonial from ${name}`}
      //pev w-384 h-216
      className="shadow-foreground/30 h-[170px] w-[300px] rounded-2xl border-none shadow-md "
    >
      <CardContent>
        <p
          aria-label={`Testimonial message: ${message}`}
          // prev `${roboto.className} font-normal text-[16px] leading-[160%] text-[#071621] `
          className={`${cardParagraph} text-subtext `}
        >
          {message}
        </p>
      </CardContent>
      <CardFooter>
        <div className="relative h-[50px] w-[50px]">
          <Image
            src={img}
            alt={`Image of ${name}`}
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="ml-4 mr-0 rtl:ml-0 rtl:mr-4">
          <h4
            aria-label={`Name: ${name}`}
            //`${cardHeading} text-heading` tried but looks bad

            className={`font-roboto text-bold text-heading  text-[16px]`}
          >
            {name}
          </h4>
          <div aria-label={`Rating: 5 out of 5 stars`} className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="text-supporting fill-supporting inline-block h-4 w-4" />
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
