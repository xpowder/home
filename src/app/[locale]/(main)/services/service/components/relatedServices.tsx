"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import ProviderCard from "@/components/shared/ProviderCard";
import { searchProviders, Provider } from "@/services/provider.services";
import { logger } from "@/lib/logger";

interface RelatedServicesProps {
  categoryId?: string;
  currentProviderId?: string;
}

export default function RelatedServices({ categoryId, currentProviderId }: RelatedServicesProps) {
  const t = useTranslations("services.service");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProviders = async () => {
      try {
        setLoading(true);
        const response = await searchProviders({
          category: categoryId || undefined,
          limit: 6,
          offset: 0,
        });
        // Filter out current provider
        const filtered = (response.providers || []).filter(
          (p) => p.id !== currentProviderId
        );
        setProviders(filtered.slice(0, 5));
      } catch (error) {
        logger.error("Error fetching related providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProviders();
  }, [categoryId, currentProviderId]);

  return (
    <div className="mt-15">
      <h2
        className="font-poppins text-heading text-[clamp(14px,1vw,20px)] font-semibold"
        id="related-services-heading"
      >
        {t("relatedServices")}
      </h2>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="text-subtext">Loading related services...</div>
        </div>
      ) : providers.length > 0 ? (
        <div
          className="scrollbar-hide flex h-full w-full items-center justify-start gap-5 overflow-x-scroll p-2"
          role="list"
          aria-labelledby="related-services-heading"
        >
          {providers.map((provider) => (
            <div role="listitem" key={provider.id} className="flex-shrink-0">
              <ProviderCard provider={provider} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-subtext py-8 text-center">
          No related services found.
        </div>
      )}
    </div>
  );
}
