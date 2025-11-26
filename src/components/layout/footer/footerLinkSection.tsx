"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { poppins } from "@/utils/fonts";

type FooterLinksSectionProps = {
  titleKey: string;
  links: { labelKey: string; href: string }[];
};

/** Reusable sub-component for a link section */
export default function FooterLinksSection({ titleKey, links }: FooterLinksSectionProps) {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  
  return (
    <div
      className="flex flex-col items-center space-y-2 text-center md:items-start  md:text-start"
      aria-label={`${titleKey} links`}
    >
      <h4 className={`${poppins.className} text-base font-semibold leading-7`}>{t(titleKey)}</h4>
      <ul className="space-y-1">
        {links.map((link) => {
          // Handle locale routing - if href doesn't start with /, add locale prefix
          const href = link.href.startsWith("/") 
            ? `/${locale}${link.href}` 
            : `/${locale}/${link.href}`;
          
          return (
            <li key={link.labelKey}>
              <Link
                href={href}
                aria-label={`Navigate to ${link.labelKey}`}
                className={`${poppins.className} text-sm font-normal leading-6 hover:underline`}
              >
                {t(link.labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
