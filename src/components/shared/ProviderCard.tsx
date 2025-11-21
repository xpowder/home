"use client";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import MapPin from "@/assets/home/offers/MapPin.svg";
import Star from "@/assets/home/offers/Star.svg";
import { Provider } from "@/services/provider.services";

interface ProviderCardProps {
  provider: Provider;
  isLikeButton?: boolean;
}

export default function ProviderCard({ provider, isLikeButton = true }: ProviderCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  const [like, setLike] = useState(false);

  const profileImage = provider.profile_picture || "/home/latestOffers/avatar1.png";
  const serviceImage = provider.service_images?.[0]?.url || "/home/latestOffers/offer1.png";
  const serviceCategory = provider.service_category?.[locale as keyof typeof provider.service_category] || provider.service_category?.en || "Service";
  const city = provider.city?.[locale as keyof typeof provider.city] || provider.city?.en || "Location";
  const rating = provider.rating || 0;
  const reviewCount = provider.review_count || 0;
  const price = provider.starting_price_mad || 0;
  const serviceTitle = provider.service_title || `${provider.first_name} ${provider.last_name}`;
  const fullName = `${provider.first_name} ${provider.last_name}`;

  return (
    <Link
      href={`/${locale}/services/${provider.id}`}
      role="article"
      aria-label={`Service by ${fullName} offer card`}
      className="bg-background/80 shadow-foreground/10 hover:shadow-foreground/25 duration-400 relative flex h-full w-[clamp(241px,25vw,324px)] min-w-[241px] flex-col items-center justify-between rounded-xl p-0 shadow-sm transition-all hover:shadow-lg"
    >
      {/* Service image */}
      <div className="relative aspect-[4/2.5] w-full p-0">
        <Image
          src={serviceImage}
          alt={`Service image for ${serviceTitle}`}
          fill
          className="rounded-t-xl object-cover"
          priority
        />
        {provider.is_active_provider && (
          <div className="absolute left-4 top-4">
            <span className="font-outfit bg-primaryDark rounded-full px-3 py-1 text-[clamp(9px,0.9vw,14px)] font-normal text-white">
              Active
            </span>
          </div>
        )}
      </div>

      {/* Provider info and rating */}
      <div
        aria-label="Provider information and rating"
        className="flex w-full items-start justify-between px-2 py-4"
      >
        <div aria-label="Provider details" className="flex h-full w-full items-center gap-2">
          <div className="relative h-[50px] w-[50px] flex-shrink-0">
            <Image
              src={profileImage}
              alt={`Provider ${fullName} Image`}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="ml-1 mr-0 flex min-w-0 flex-1 flex-col justify-center rtl:ml-0 rtl:mr-1">
            <h3
              aria-label={`Name: ${fullName}`}
              className={`font-roboto text-heading ml-2 truncate text-[clamp(14px,3vw,18px)] font-semibold leading-6`}
            >
              {fullName}
            </h3>
            <div
              aria-label={`provider Location ${city}`}
              className={`font-roboto text-heading flex items-baseline justify-start gap-1 text-[clamp(10px,3vw,14px)] font-semibold`}
            >
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{city}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 text-[clamp(12px,3vw,16px)] font-semibold">
          <Star className="text-supporting fill-supporting h-3 w-3" />
          <span className="text-subtext whitespace-nowrap">
            {rating.toFixed(1)}({reviewCount})
          </span>
        </div>
      </div>

      {/* Service details */}
      <div className="w-full space-y-2 px-2 pb-6">
        <div className="text-subtext text-[clamp(10px,3vw,14px)] font-semibold">
          {serviceCategory}
        </div>
        <h3
          className={`font-poppins text-heading line-clamp-2 text-[clamp(14px,3vw,18px)] font-semibold leading-7`}
        >
          {serviceTitle}
        </h3>
        <p
          className={`font-poppins text-primaryDark text-[clamp(12px,3vw,16px)] font-semibold leading-7`}
        >
          From {price} MAD
        </p>
      </div>

      {isLikeButton ? (
        <div className="absolute right-2 top-2 flex space-x-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLike((prev) => !prev);
            }}
            className="cursor-pointer rounded-full bg-white/80 p-2 shadow-lg transition-all duration-200 hover:bg-white"
            aria-label="Save provider"
          >
            <Heart className={`${like ? "fill-red-400 text-red-400" : "text-gray-400"} h-4 w-4`} />
          </button>
        </div>
      ) : null}
    </Link>
  );
}

