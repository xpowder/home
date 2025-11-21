"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import PostCard from "../homeComponents/postCard/PostCard";
import ProviderCard from "@/components/shared/ProviderCard";
import ServicesHero from "./components/ServicesHero";
import { searchProviders, Provider } from "@/services/provider.services";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const category = searchParams.get("category");
  const city = searchParams.get("city");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await searchProviders({
          category: category || undefined,
          city: city || undefined,
          limit: 20,
          offset: 0,
        });
        setProviders(response.providers || []);
        setHasMore(response.count > response.providers.length);
        setOffset(response.providers.length);
      } catch (error) {
        logger.error("Error fetching providers:", error);
        toast.error("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [category, city]);

  const loadMore = async () => {
    try {
      const response = await searchProviders({
        category: category || undefined,
        city: city || undefined,
        limit: 20,
        offset,
      });
      setProviders((prev) => [...prev, ...(response.providers || [])]);
      setHasMore(response.count > providers.length + response.providers.length);
      setOffset((prev) => prev + response.providers.length);
    } catch (error) {
      logger.error("Error loading more providers:", error);
      toast.error("Failed to load more services.");
    }
  };

  return (
    <section className="w-full">
      <ServicesHero />
      <div className="container space-y-5 p-5">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-subtext text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-lg">Loading services...</p>
            </div>
          </div>
        ) : providers.length > 0 ? (
          <>
            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              role="list"
              aria-label="Service providers list"
            >
              {providers.map((provider) => (
                <div key={provider.id} role="listitem">
                  <ProviderCard provider={provider} />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center py-8">
                <button
                  onClick={loadMore}
                  className="bg-primary hover:bg-btnHover font-roboto rounded-lg px-8 py-3 text-white transition-colors"
                  aria-label="Load more services"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-heading mb-2 text-xl font-semibold">No services found</p>
              <p className="text-subtext">Try adjusting your filters or search criteria.</p>
            </div>
          </div>
        )}
        <PostCard />
      </div>
    </section>
  );
}
