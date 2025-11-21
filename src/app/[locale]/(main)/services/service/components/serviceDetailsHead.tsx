"use client";
import React from "react";

import MapPin from "@/assets/home/offers/MapPin.svg";
import Star from "@/assets/home/offers/Star.svg";
import Clock from "@/assets/services/Clock.svg";
import { sectionHeading } from "@/utils/fonts";

type ServiceData = {
  title: string;
  provider_name: string;
  provider_location: string;
  rating: number;
  reviews_count: number;
  work_time: string;
  price: number;
};

// ✅ Placeholder / demo data
const placeholderData: ServiceData = {
  title: "Deep Home Cleaning in Casablanca",
  provider_name: "Fatima El Amrani",
  provider_location: "Casablanca",
  rating: 4.4,
  reviews_count: 127,
  work_time: "3–4 hours",
  price: 150,
};

export default function ServiceDetailsHead({
  data = placeholderData, // ✅ fallback if no prop provided
}: {
  data?: ServiceData;
}) {
  const fullStars = Math.floor(data.rating);
  const hasHalfStar = data.rating % 1 <= 0.5;

  return (
    <div
      role="region"
      aria-labelledby="service-title"
      aria-describedby="service-info"
      className="space-y-3"
    >
      {/* Service title */}
      <h2
        id="service-title"
        aria-label={`Service: ${data.title}`}
        className={`${sectionHeading} text-heading`}
      >
        {data.title}
      </h2>

      {/* Info row */}
      <div className="text-subtext flex flex-wrap items-center gap-4">
        {/* Provider */}
        <span
          aria-label={`Provided by ${data.provider_name}`}
          className="font-inter text-[clamp(12px,1vw,18px)]"
        >
          by <span className="font-medium">{data.provider_name}</span>
        </span>

        {/* Location */}
        <span
          aria-label={`Location: ${data.provider_location}`}
          className="flex items-center gap-2 text-[clamp(12px,1vw,18px)]"
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {data.provider_location}
        </span>

        {/* Rating */}
        <span
          aria-label={`Average rating ${data.rating} out of 5 from ${data.reviews_count} reviews`}
          className="flex items-center gap-2 text-[clamp(12px,1vw,16px)]"
        >
          <span className="flex items-center gap-0.5">
            {Array.from({ length: Math.ceil(data.rating) }, (_, i) => {
              if (i < fullStars) return <Star key={i} className="h-4 w-4 text-yellow-500" />;
              if (i === fullStars && hasHalfStar)
                return <Star key={i} className="h-4 w-4 text-yellow-300 opacity-70" />;
              return <Star key={i} className="h-4 w-4 text-gray-300" />;
            })}
          </span>
          <span>
            <span className="font-semibold">{data.rating}</span> ({data.reviews_count} reviews)
          </span>
        </span>

        {/* Work time */}
        <span
          aria-label={`Estimated work time: ${data.work_time}`}
          className="flex items-center gap-2 text-[clamp(12px,1vw,16px)]"
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          {data.work_time}
        </span>
      </div>

      {/* Price */}
      <h3
        aria-label={`Starting price ${data.price}`}
        className="font-poppins text-primaryDark text-[clamp(20px,2vw,30px)] font-bold"
      >
        From {data.price} MAD
      </h3>
    </div>
  );
}
