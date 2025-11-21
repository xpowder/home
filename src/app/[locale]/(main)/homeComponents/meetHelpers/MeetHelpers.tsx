"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import MeetHelperCard from "@/components/shared/MeetHerlperCard";
import SectionButton from "@/components/shared/SectionButton";
import SectionHeaderWithDivider from "@/components/shared/SectionHeaderWithDivider";
import { searchProviders, Provider } from "@/services/provider.services";
import { logger } from "@/lib/logger";
import { useParams } from "next/navigation";

export default function MeetHelpers() {
  const t = useTranslations("meetHelpers");
  const params = useParams();
  const locale = params.locale as string;
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await searchProviders({
          limit: 5,
          offset: 0,
          sort: "rating",
        });
        setProviders(response.providers || []);
      } catch (error) {
        logger.error("Error fetching top providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const convertProviderToHelperCard = (provider: Provider) => {
    const category = provider.service_category?.[locale as keyof typeof provider.service_category] || provider.service_category?.en || "Service";
    const city = provider.city?.[locale as keyof typeof provider.city] || provider.city?.en || "Location";
    
    return {
      img: provider.profile_picture || "/home/meetHelpers/helper1.png",
      name: `${provider.first_name} ${provider.last_name}`,
      jobDone: `${provider.review_count || 0} jobs completed`,
      location: city,
      rating: (provider.rating || 0).toFixed(1),
      category: [category],
      color: "#018CFA",
      providerId: provider.id,
    };
  };

  return (
    <section className="container">
      <SectionHeaderWithDivider
        heading={t("heading")}
        description={t("description")}
        divider={true}
      />
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-subtext">Loading providers...</div>
        </div>
      ) : (
        <>
          <div className="scrollbar-hide flex h-full w-full items-center justify-start gap-5 overflow-x-scroll p-5 md:p-10">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <div key={provider.id} className="flex-shrink-0">
                  <MeetHelperCard data={convertProviderToHelperCard(provider)} />
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
