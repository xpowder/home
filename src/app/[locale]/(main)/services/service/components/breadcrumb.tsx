"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import React from "react";

import ArrowRight from "@/assets/providerDashboard/ArrowRight.svg";
import HomeGray from "@/assets/providerDashboard/HomeGray.svg";
import { Provider } from "@/services/provider.services";

interface BreadcrumbProps {
  provider?: Provider | null;
}

export default function Breadcrumb({ provider }: BreadcrumbProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  
  let segments = pathname.split("/").filter(Boolean);

  // Remove the first segment if it's a locale code
  const locales = ["en", "fr", "ar"];
  if (locales.includes(segments[0])) {
    segments = segments.slice(1);
  }

  // Check if we're on a provider details page (services/[id])
  const isProviderDetailsPage = segments.length >= 2 && segments[0] === "services" && segments[1]?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

  // Decode segment and replace '+' with space
  const formatSegment = (segment: string, index: number) => {
    // If it's a UUID (provider ID) and we have provider data, show category name instead
    if (isProviderDetailsPage && index === 1 && segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      if (provider?.service_category) {
        const categoryName = provider.service_category[locale as keyof typeof provider.service_category] 
          || provider.service_category.en 
          || "Service";
        return categoryName;
      }
    }
    return decodeURIComponent(segment.replace(/\+/g, " "));
  };

  return (
    <nav
      className="dark:bg-secondary bg-white"
      aria-label="Breadcrumb"
    >
      <ol className="container flex space-x-2 p-5">
        {/* Home link */}
        <li>
          <Link
            href={`/${locale}`}
            className="font-roboto text-subtext flex items-center justify-center gap-2 text-[clamp(12px,1vw,18px)] font-semibold"
          >
            <HomeGray className="h-[clamp(12px,1vw,18px)] min-h-3 w-[clamp(12px,1vw,18px)] min-w-3" />
            Home
          </Link>
        </li>

        {/* Dynamically render the rest of the path */}
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = `/${locale}/` + segments.slice(0, index + 1).join("/");
          const displayText = formatSegment(segment, index);

          return (
            <li key={href} className="flex items-center" aria-current={isLast ? "page" : undefined}>
              {/* Arrow separator */}
              <span className="mx-1">
                <ArrowRight className="h-[clamp(12px,1vw,18px)] min-h-3 w-[clamp(12px,1vw,18px)] min-w-3" />
              </span>

              {/* Last segment is not a link, others are */}
              {isLast ? (
                <span className="font-roboto text-subtext text-[clamp(12px,1vw,18px)] font-semibold">
                  {displayText}
                </span>
              ) : (
                <Link
                  className="font-roboto text-subtext text-[clamp(12px,1vw,18px)] font-semibold"
                  href={href}
                >
                  {displayText}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
