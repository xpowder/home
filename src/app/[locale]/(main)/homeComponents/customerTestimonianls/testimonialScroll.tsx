import "@/styles/smoothScroll.css";

import { getTranslations } from "next-intl/server";

import { testimonialList } from "@/utils/constants/homeData";

import TestimonialCard from "./testimonialCard";

export default async function SmoothTestimonialScroll() {
  const t = await getTranslations();
  return (
    <div
      className="slider"
      data-reverse="true"
      aria-label="Auto-scrolling list of customer testimonials"
      style={
        {
          "--width": "300px", // match your item width w-384 h-216
          "--height": "190px", // match your item height
          "--quantity": testimonialList.length, // how many items
        } as React.CSSProperties
      }
    >
      <div className="list">
        {testimonialList.map((item, index) => (
          <div
            key={index}
            style={{ "--position": index + 1 } as React.CSSProperties}
            className="item flex flex-col items-center justify-center gap-2 rounded-lg p-2"
          >
            <TestimonialCard
              message={t(`${item.key}.message`)}
              name={t(`${item.key}.name`)}
              img={item.img}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
