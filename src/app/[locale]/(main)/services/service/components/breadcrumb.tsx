"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import ArrowRight from "@/assets/providerDashboard/ArrowRight.svg";
import HomeGray from "@/assets/providerDashboard/HomeGray.svg";

export default function Breadcrumb() {
  const pathname = usePathname(); // Get the current URL path
  let segments = pathname.split("/").filter(Boolean); // Split and remove empty segments

  // Remove the first segment if it's a locale code
  const locales = ["en", "fr", "ar"];
  if (locales.includes(segments[0])) {
    segments = segments.slice(1);
  }

  // Decode segment and replace '+' with space
  const formatSegment = (segment: string) => decodeURIComponent(segment.replace(/\+/g, " "));

  return (
    <nav
      className="dark:bg-secondary bg-white"
      aria-label="Breadcrumb" // ARIA label for screen readers
    >
      <ol className="container flex space-x-2 p-5">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="font-roboto text-subtext flex items-center justify-center gap-2 text-[clamp(12px,1vw,18px)] font-semibold"
          >
            <HomeGray className="h-[clamp(12px,1vw,18px)] min-h-3 w-[clamp(12px,1vw,18px)] min-w-3" />
            Home
          </Link>
        </li>

        {/* Dynamically render the rest of the path */}
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");

          return (
            <li key={href} className="flex items-center" aria-current={isLast ? "page" : undefined}>
              {/* Arrow separator */}
              <span className="mx-1">
                <ArrowRight className="h-[clamp(12px,1vw,18px)] min-h-3 w-[clamp(12px,1vw,18px)] min-w-3" />
              </span>

              {/* Last segment is not a link, others are */}
              {isLast ? (
                <span className="font-roboto text-subtext text-[clamp(12px,1vw,18px)] font-semibold">
                  {formatSegment(segment)}
                </span>
              ) : (
                <Link
                  className="font-roboto text-subtext text-[clamp(12px,1vw,18px)] font-semibold"
                  href={href}
                >
                  {formatSegment(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
