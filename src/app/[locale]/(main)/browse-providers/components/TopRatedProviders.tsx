"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import ProviderCard from "@/components/shared/ProviderCard";
import { searchProviders, Provider } from "@/services/provider.services";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { poppins } from "@/utils/fonts";

export default function TopRatedProviders() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("browseProviders.topRated");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRatedProviders = async () => {
      try {
        setLoading(true);
        // Fetch top rated providers sorted by rating
        const response = await searchProviders({
          sort: "rating_desc",
          limit: 10,
          offset: 0,
          min_reviews: 1, // At least one review to be considered "rated"
        });
        setProviders(response.providers || []);
      } catch (error) {
        logger.error("Error fetching top rated providers:", error);
        toast.error("Failed to load top rated providers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedProviders();
  }, []);

  return (
    <section aria-label="Top Rated Providers Section">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${poppins.className} text-heading text-2xl md:text-3xl font-bold`}>
          {t("title")}
        </h2>
        <Link
          href={`/${locale}/services?sort=rating_desc`}
          className="flex items-center gap-1 text-primary hover:text-primaryDark font-semibold transition-colors"
          aria-label="View all providers"
        >
          <span>{t("viewAll")}</span>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-subtext text-lg">Loading top rated providers...</p>
          </div>
        </div>
      ) : providers.length > 0 ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-5 min-w-max" role="list" aria-label="Top rated providers carousel">
            {providers.map((provider) => (
              <div key={provider.id} role="listitem" className="flex-shrink-0">
                <ProviderCard provider={provider} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-heading mb-2 text-xl font-semibold">{t("noProviders")}</p>
            <p className="text-subtext">Try adjusting your search criteria.</p>
          </div>
        </div>
      )}
    </section>
  );
}

