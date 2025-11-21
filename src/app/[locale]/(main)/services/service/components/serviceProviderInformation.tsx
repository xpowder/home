"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import MapPin from "@/assets/home/hero/MapPin.svg";
import Clock from "@/assets/home/hero/support.svg";
import Verified from "@/assets/home/hero/verifiedProfessionals.svg";
import BlueTick from "@/assets/providerDashboard/TickRound.svg";
import CallWhite from "@/assets/services/CallWhite.svg";
import RedFlag from "@/assets/services/RedFlag.svg";
import WhatsappWhite from "@/assets/services/WhatsappWhite.svg";
import { Provider } from "@/services/provider.services";
import MessageButton from "./MessageButton";

interface ServiceProviderInformationProps {
  provider?: Provider;
}

export default function ServiceProviderInformation({ provider }: ServiceProviderInformationProps) {
  const params = useParams();
  const locale = params.locale as string;
  
  if (!provider) {
    return null;
  }

  const data = {
    image: provider.profile_picture || "/home/latestOffers/avatar1.png",
    name: `${provider.first_name} ${provider.last_name}`,
    category: provider.service_category?.[locale as keyof typeof provider.service_category] || provider.service_category?.en || "Service Provider",
    location: provider.city?.[locale as keyof typeof provider.city] || provider.city?.en || provider.full_address || "Location",
    experience: provider.years_experience ? `${provider.years_experience}+ years experience` : "Experienced provider",
    isVerified: provider.is_active_provider,
    phone: provider.phone || "",
  };
  const t = useTranslations("services.service.contact");

  return (
    // Container for service provider information
    <div
      className="h-125 dark:bg-secondary flex w-full flex-col items-center gap-5 rounded-xl bg-white px-10 py-5"
      role="region"
      aria-label="Service provider information card"
    >
      {/* Profile image and basic details */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div
          className="relative h-12 w-12 rounded-full"
          role="img"
          aria-label={`Profile image of ${data.name}`}
        >
          <Image
            src={data.image}
            alt={`Profile picture of ${data.name}`}
            fill
            className="object-cover"
            priority
            fetchPriority="high"
          />
          {/* Verified badge */}
          {data.isVerified && (
            <BlueTick
              className="absolute bottom-0 right-0 h-3 w-3"
              role="img"
              aria-label="Verified badge"
            />
          )}
        </div>

        {/* Name and category */}
        <div className="space-y-1 text-center">
          <h4
            className="font-inter text-heading text-[clamp(12px,1vw,16px)] font-semibold"
            aria-label={`Name: ${data.name}`}
          >
            {data.name}
          </h4>
          <span
            className="font-inter text-subtext text-[clamp(10px,1vw,14px)] font-normal"
            aria-label={`Category: ${data.category}`}
          >
            {data.category}
          </span>
        </div>
      </div>

      {/* Provider details section */}
      <div className="space-y-3" aria-label="Provider details">
        {/* Location */}
        <span
          className="font-inter text-heading/90 flex items-center gap-2 text-[clamp(12px,1vw,16px)] font-normal"
          aria-label={`Location: ${data.location}`}
        >
          <MapPin
            className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
            role="img"
            aria-hidden="true"
          />
          {data.location}
        </span>

        {/* Experience */}
        <span
          className="font-inter text-heading/90 flex items-center gap-2 text-[clamp(12px,1vw,16px)] font-normal"
          aria-label={`Experience: ${data.experience}`}
        >
          <Clock
            className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
            role="img"
            aria-hidden="true"
          />
          {data.experience}
        </span>

        {/* Verification status */}
        <span
          className="font-inter text-heading/90 flex items-center gap-2 text-[clamp(12px,1vw,16px)] font-normal"
          aria-label={`Verification status: ${data.isVerified ? "Background Verified" : "Background Not Verified"}`}
        >
          <Verified
            className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
            role="img"
            aria-hidden="true"
          />
          {data.isVerified ? "Background Verified" : "Background Not Verified"}
        </span>
      </div>

      {/* Action buttons */}
      <div className="w-full space-y-3" role="group" aria-label="Action buttons">
        {/* Call button */}
        {data.phone && (
          <a
            href={`tel:${data.phone}`}
            className="font-roboto bg-btn hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-[clamp(40px,2vh,48px)] w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-[clamp(12px,1vw,16px)] font-normal text-white duration-300 hover:-translate-y-px hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
            aria-label={`Call ${data.name}`}
          >
            <CallWhite
              className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
              role="img"
              aria-hidden="true"
            />
            {t("call")}
          </a>
        )}

        {/* WhatsApp button */}
        {data.phone && (
          <a
            href={`https://wa.me/${data.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-roboto disabled:bg-btnDisabled flex h-[clamp(40px,2vh,48px)] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-500 text-[clamp(12px,1vw,16px)] font-normal text-white duration-300 hover:-translate-y-px hover:bg-green-600 hover:shadow-xl focus:bg-green-500 focus:ring-green-500 active:bg-green-700 active:shadow-sm disabled:text-[#E5E5E5]"
            aria-label={`Chat with ${data.name} on WhatsApp`}
          >
            <WhatsappWhite
              className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
              role="img"
              aria-hidden="true"
            />
            {t("whatsapp")}
          </a>
        )}

        {/* Message button */}
        <MessageButton providerId={provider.id} providerName={data.name} locale={locale} />

        {/* Report button */}
        <button
          className="font-roboto disabled:bg-btnDisabled flex h-[clamp(40px,2vh,48px)] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-100 text-[clamp(12px,1vw,16px)] font-normal text-red-600 duration-300 hover:-translate-y-px hover:bg-red-200 hover:shadow-xl focus:bg-red-100 focus:ring-red-100 active:bg-red-300 active:shadow-sm disabled:text-[#E5E5E5]"
          aria-label={`Report ${data.name}`}
        >
          <RedFlag
            className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
            role="img"
            aria-hidden="true"
          />
          {t("report")}
        </button>
      </div>
    </div>
  );
}
