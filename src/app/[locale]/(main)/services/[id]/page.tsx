"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import PostCard from "../../homeComponents/postCard/PostCard";
import Breadcrumb from "../service/components/breadcrumb";
import RelatedServices from "../service/components/relatedServices";
import ServiceDetailsCarosel from "../service/components/serviceDetailsCarosel";
import ServiceDetailsHead from "../service/components/serviceDetailsHead";
import ServiceInfo from "../service/components/serviceInfo";
import { getProviderDetails, Provider } from "@/services/provider.services";
import { logger } from "@/lib/logger";

export default function ProviderDetailsPage() {
  const params = useParams();
  const providerId = params.id as string;
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getProviderDetails(providerId);
        setProvider(response.provider);
      } catch (error) {
        logger.error("Error fetching provider details:", error);
        toast.error("Failed to load provider details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  if (loading) {
    return (
      <section className="bg-secondary/30 pt-3">
        <div className="container flex min-h-[400px] items-center justify-center p-5">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-subtext text-lg">Loading provider details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!provider) {
    return (
      <section className="bg-secondary/30 pt-3">
        <div className="container flex min-h-[400px] items-center justify-center p-5">
          <div className="text-center">
            <p className="text-heading mb-2 text-xl font-semibold">Provider not found</p>
            <p className="text-subtext">The provider you're looking for doesn't exist.</p>
          </div>
        </div>
      </section>
    );
  }

  const locale = params.locale as string;
  const serviceData = {
    title: provider.service_title || `${provider.first_name} ${provider.last_name}`,
    provider_name: `${provider.first_name} ${provider.last_name}`,
    provider_location: provider.city?.[locale as keyof typeof provider.city] || provider.city?.en || "Location",
    rating: provider.rating || 0,
    reviews_count: provider.review_count || 0,
    work_time: "3–4 hours",
    price: provider.starting_price_mad || 0,
  };

  return (
    <section className="bg-secondary/30 pt-3">
      <Breadcrumb provider={provider} />
      <div className="container space-y-5 p-5">
        <ServiceDetailsHead data={serviceData} />
        <ServiceDetailsCarosel provider={provider} />
        <ServiceInfo provider={provider} />
        <RelatedServices categoryId={provider.service_category?.en} currentProviderId={provider.id} />
        <PostCard />
      </div>
    </section>
  );
}

