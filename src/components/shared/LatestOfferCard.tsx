"use client";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import MapPin from "@/assets/home/offers/MapPin.svg";
// import { Star, MapPin } from "lucide-react"
import Star from "@/assets/home/offers/Star.svg";
import useComingSoonAlert from "@/hooks/useCommingSoonAlert";
import { LatestOfferCardType } from "@/types/home/latestOfferType";

interface LatestOfferCardProps {
  data: LatestOfferCardType;
  isLikeButton?: boolean;
}

export default function LatestOfferCard({ data, isLikeButton = true }: LatestOfferCardProps) {
  const showCommingSoon = useComingSoonAlert();
  const [like, setLike] = useState(false);
  return (
    <div
      onClick={showCommingSoon}
      role="article"
      aria-label={`Latest service by ${data.name} offer card`}
      className="bg-background/80 shadow-foreground/10 hover:shadow-foreground/25 duration-400 relative flex h-full w-[clamp(241px,25vw,324px)] flex-col items-center justify-between rounded-xl p-0 shadow-sm hover:shadow-lg"
    >
      {/* [clamp(362px,33vh,455px)] */}
      {/* Offer image  added aspect ratio*/}
      <div className="relative aspect-[4/2.5] w-[clamp(241px,25vw,324px)] p-0">
        <Image
          src={data.img}
          alt={`Latest Offer Image of ${data.serviceName}`}
          fill
          sizes="(max-width: 768px) 241px, (max-width: 1200px) 25vw, 324px"
          className="rounded-t-xl object-cover "
          priority
        />
      </div>
      {/* Provider info and rating */}
      <div
        aria-label="Provider information and rating"
        className="flex w-full items-start justify-between px-2 py-4"
      >
        <div aria-label="Provider details" className="flex h-full w-full">
          <div className="relative h-[50px] w-[50px]">
            <Image
              src={data.avatar}
              alt={`Latest Offer Provider ${data.name} Image`}
              fill
              sizes="50px"
              className="rounded-full object-cover"
            />
          </div>
          <div className="ml-1 mr-0 flex flex-col justify-center rtl:ml-0 rtl:mr-1 ">
            <h3
              aria-label={`Name: ${data.name}`}
              className={`font-roboto text-heading ml-2 text-[clamp(14px,3vw,18px)] font-semibold leading-6`}
            >
              {data.name}
            </h3>
            <div
              aria-label={`provider Location ${data.location} `}
              className={`font-roboto text-heading flex items-baseline justify-center gap-1 text-[clamp(10px,3vw,14px)] font-semibold`}
            >
              <MapPin className="h-3 w-3" />
              <span>{data.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 text-[clamp(12px,3vw,16px)] font-semibold">
          <Star className="text-supporting fill-supporting h-3 w-3" />
          <span className="text-subtext">{data.rating}</span>
        </div>
      </div>
      {/* Service details */}
      <div className="w-full space-y-2 px-2 pb-6">
        <div className="text-subtext text-[clamp(10px,3vw,14px)] font-semibold">
          {data.serviceType}
        </div>
        <h3
          className={`font-poppins text-heading overflow-x-hidden text-ellipsis   whitespace-nowrap text-[clamp(14px,3vw,18px)] font-semibold leading-7  `}
        >
          {data.serviceName}
        </h3>
        <p
          className={`font-poppins text-primaryDark text-[clamp(12px,3vw,16px)] font-semibold   leading-7 `}
        >
          From {data.price} MAD
        </p>
      </div>
      <div className="absolute left-4 top-4">
        {data.featured ? (
          <span className="font-outfit text-primaryDark bg-primaryLight rounded-full p-2 text-[clamp(9px,0.9vw,14px)] font-normal">
            Featured
          </span>
        ) : data.active ? (
          <span className="font-outfit bg-primaryDark rounded-full p-2 text-[clamp(9px,0.9vw,14px)] font-normal text-white">
            Active
          </span>
        ) : null}
      </div>
      {isLikeButton ? (
        <div className="absolute right-2 top-2 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // stop click from bubbling to parent
              setLike((prev) => !prev);
            }}
            className="cursor-pointer rounded-full bg-white/80 shadow-lg transition-all duration-200 hover:bg-white sm:p-2"
            aria-label="Love"
          >
            <Heart className={`${like ? "fill-red-400 text-red-400" : "text-gray-400"} h-4 w-4`} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
