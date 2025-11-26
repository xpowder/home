"use client";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useCallback } from "react";

import MapPin from "@/assets/home/offers/MapPin.svg";
import Star from "@/assets/home/offers/Star.svg";
import VerifiedIcon from "@/assets/home/offers/VerifiedIcon.svg";
import { Provider } from "@/services/provider.services";

interface ProviderCardProps {
  provider: Provider;
  isLikeButton?: boolean;
}

export default function ProviderCard({ provider, isLikeButton = true }: ProviderCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  const [like, setLike] = useState(false);
  const [serviceImageError, setServiceImageError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  // Handle service_images - can be array of strings or array of objects with url
  const getServiceImage = () => {
    if (serviceImageError) {
      return "/home/latestOffers/offer1.png";
    }
    if (!provider.service_images || provider.service_images.length === 0) {
      return "/home/latestOffers/offer1.png";
    }
    const firstImage = provider.service_images[0];
    return typeof firstImage === 'string' ? firstImage : firstImage?.url || "/home/latestOffers/offer1.png";
  };

  const handleServiceImageError = useCallback(() => {
    setServiceImageError(true);
  }, []);

  const handleProfileImageError = useCallback(() => {
    setProfileImageError(true);
  }, []);

  const profileImage = profileImageError ? "/home/latestOffers/avatar1.png" : (provider.profile_picture || "/home/latestOffers/avatar1.png");
  const serviceImage = getServiceImage();
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
      className="bg-background/80 shadow-foreground/10 hover:shadow-foreground/25 duration-400 relative flex h-full w-full max-w-[324px] min-w-[280px] sm:min-w-[241px] flex-col items-center justify-between rounded-xl p-0 shadow-sm transition-all hover:shadow-lg mx-auto"
    >
      {/* Service image */}
      <div className="relative aspect-[4/2.5] w-full p-0">
        <Image
          src={serviceImage}
          alt={`Service image for ${serviceTitle}`}
          fill
          sizes="(max-width: 768px) 241px, (max-width: 1200px) 25vw, 324px"
          className="rounded-t-xl object-cover"
          priority
          onError={handleServiceImageError}
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
        <div aria-label="Provider details" className="flex h-full w-full items-center gap-2 sm:gap-3">
          <div className="relative h-12 w-12 sm:h-[50px] sm:w-[50px] flex-shrink-0">
            <Image
              src={profileImage}
              alt={`Provider ${fullName} Image`}
              fill
              sizes="(max-width: 640px) 48px, 50px"
              className="rounded-full object-cover"
              onError={handleProfileImageError}
            />
          </div>
          <div className="ml-1 mr-0 flex min-w-0 flex-1 flex-col justify-center rtl:ml-0 rtl:mr-1">
            <div className="flex items-center gap-1.5 ml-2">
              <h3
                aria-label={`Name: ${fullName}`}
                className={`font-roboto text-heading truncate text-sm sm:text-base md:text-lg font-semibold leading-6`}
              >
                {fullName}
              </h3>
              {provider.is_active_provider && (
                <VerifiedIcon 
                  className="text-primary fill-primary h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" 
                  aria-label="Verified provider"
                />
              )}
            </div>
            <div
              aria-label={`provider Location ${city}`}
              className={`font-roboto text-heading flex items-baseline justify-start gap-1 text-xs sm:text-sm font-semibold`}
            >
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{city}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 text-sm sm:text-base font-semibold">
          <Star className="text-supporting fill-supporting h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="text-subtext whitespace-nowrap">
            {rating.toFixed(1)}({reviewCount})
          </span>
        </div>
      </div>

      {/* Service details */}
      <div className="w-full space-y-2 px-3 pb-4 sm:pb-6">
        <div className="text-subtext text-xs sm:text-sm font-semibold">
          {serviceCategory}
        </div>
        <h3
          className={`font-poppins text-heading line-clamp-2 text-sm sm:text-base md:text-lg font-semibold leading-6 sm:leading-7`}
        >
          {serviceTitle}
        </h3>
        <p
          className={`font-poppins text-primaryDark text-sm sm:text-base font-semibold leading-6 sm:leading-7`}
        >
          From {price} MAD
        </p>
      </div>

      {isLikeButton ? (
        <div className="absolute right-2 top-2 flex space-x-2">
          <button
            onClick={(e) => {
              try {
                e.preventDefault();
                e.stopPropagation();
                setLike((prev) => !prev);
              } catch (error) {
                console.error("Error in like button handler:", error);
              }
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

