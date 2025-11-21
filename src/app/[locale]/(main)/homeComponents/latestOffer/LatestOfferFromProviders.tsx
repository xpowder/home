"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import SectionButton from "@/components/shared/SectionButton";
import ProviderCard from "@/components/shared/ProviderCard";
import SectionHeaderWithDivider from "@/components/shared/SectionHeaderWithDivider";
import { searchProviders, Provider } from "@/services/provider.services";
import { logger } from "@/lib/logger";

export default function LatestOfferFromProviders() {
  const t = useTranslations("latestOffers");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await searchProviders({
          limit: 8,
          offset: 0,
          sort: "newest",
        });
        setProviders(response.providers || []);
      } catch (error) {
        logger.error("Error fetching latest providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return (
    <section className="container my-5" role="region" aria-labelledby="latest-offers-heading">
      <SectionHeaderWithDivider
        heading={<span id="latest-offers-heading">{t("heading")}</span>}
        description={t("description")}
        divider={true}
      />

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-subtext">Loading providers...</div>
        </div>
      ) : (
        <>
          <div
            className="scrollbar-hide flex h-full w-full items-center justify-start gap-5 overflow-x-scroll p-5"
            role="list"
            aria-label="Latest service offers from verified providers"
          >
            {providers.length > 0 ? (
              providers.map((provider) => (
                <div role="listitem" key={provider.id} className="flex-shrink-0">
                  <ProviderCard provider={provider} isLikeButton={false} />
                </div>
              ))
            ) : (
              <div className="text-subtext w-full py-8 text-center">
                No providers available at the moment.
              </div>
            )}
          </div>
          <div className="flex items-center justify-center pb-16 pt-8">
            <Link href="/services">
              <SectionButton
                bg="bg-primary"
                text={t("sectionButton")}
                icon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
                aria-label={t("sectionButton")}
              />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
