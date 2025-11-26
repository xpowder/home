"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProviderCard from "@/components/shared/ProviderCard";
import { searchProviders, Provider, ProviderFilters } from "@/services/provider.services";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { poppins } from "@/utils/fonts";
import useCatagory from "@/hooks/useCatagory";
import useCity from "@/hooks/useCity";
import SelectField from "../../services/components/selectField";

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Highest Rated", value: "rating_desc" },
  { label: "Lowest Rated", value: "rating_asc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function AllProviders() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const t = useTranslations("browseProviders.allProviders");
  const { categories } = useCatagory();
  const { cities } = useCity();
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [limit] = useState(15); // 15 providers per page (3 rows x 5 cards)

  // Get filters from URL params
  const categoryParam = searchParams.get("category");
  const cityParam = searchParams.get("city");
  const minPriceParam = searchParams.get("min_price");
  const minRatingParam = searchParams.get("min_rating");

  // Convert IDs to names for API
  const getCategoryName = useCallback((id: string | null) => {
    if (!id || !categories) return undefined;
    const category = categories.find((c) => c.id === id);
    if (!category) return undefined;
    return category[`name_${locale}` as keyof typeof category] as string || category.name_en;
  }, [categories, locale]);

  const getCityName = useCallback((id: string | null) => {
    if (!id || !cities) return undefined;
    const city = cities.find((c) => c.id === id);
    if (!city) return undefined;
    return city[`name_${locale}` as keyof typeof city] as string || city.name_en;
  }, [cities, locale]);

  const fetchProviders = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      
      const categoryName = getCategoryName(categoryParam);
      const cityName = getCityName(cityParam);
      
      // Map sort options to API sort parameter
      let apiSort: string | undefined;
      switch (sortBy) {
        case "newest":
          apiSort = "created_desc";
          break;
        case "oldest":
          apiSort = "created_asc";
          break;
        case "rating_desc":
          apiSort = "rating_desc";
          break;
        case "rating_asc":
          apiSort = "rating_asc";
          break;
        case "price_asc":
          apiSort = "price_asc";
          break;
        case "price_desc":
          apiSort = "price_desc";
          break;
        default:
          apiSort = "created_desc";
      }

      const filters: ProviderFilters = {
        category: categoryName,
        city: cityName,
        limit,
        offset: (page - 1) * limit,
        sort: apiSort,
      };

      if (minPriceParam) {
        filters.min_price = parseInt(minPriceParam);
      }

      if (minRatingParam) {
        filters.min_reviews = 1; // At least one review if rating filter is set
      }

      const response = await searchProviders(filters);
      
      let filteredProviders = response.providers || [];
      
      // Filter by verified/active status if checked
      if (verifiedOnly) {
        filteredProviders = filteredProviders.filter(p => p.is_active_provider === true);
      }

      // Filter by minimum rating if specified
      if (minRatingParam) {
        const minRating = parseFloat(minRatingParam);
        filteredProviders = filteredProviders.filter(p => (p.rating || 0) >= minRating);
      }

      setProviders(filteredProviders);
      setTotalCount(response.count || 0);
    } catch (error) {
      logger.error("Error fetching providers:", error);
      toast.error("Failed to load providers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [categoryParam, cityParam, minPriceParam, minRatingParam, sortBy, verifiedOnly, limit, getCategoryName, getCityName]);

  useEffect(() => {
    fetchProviders(currentPage);
  }, [currentPage, fetchProviders]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchProviders(1);
  }, [categoryParam, cityParam, minPriceParam, minRatingParam, sortBy, verifiedOnly]);

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 2) {
        endPage = 3;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }

      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <section id="all-providers-section" aria-label="All Providers Section">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className={`${poppins.className} text-heading text-2xl md:text-3xl font-bold`}>
          {t("title")}
        </h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Verified Only Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              aria-label="Verified Only"
            />
            <span className={`${poppins.className} text-sm font-medium text-heading`}>
              {t("verifiedOnly")}
            </span>
          </label>

          {/* Sort Dropdown */}
          <SelectField
            name="sort"
            items={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder={t("sortBy")}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            className="min-w-[180px]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-subtext text-lg">{t("loading")}</p>
          </div>
        </div>
      ) : providers.length > 0 ? (
        <>
          <div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            role="list"
            aria-label="All providers list"
          >
            {providers.map((provider) => (
              <div key={provider.id} role="listitem">
                <ProviderCard provider={provider} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {renderPagination().map((page, index) => {
                if (page === "ellipsis-start" || page === "ellipsis-end") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                      currentPage === page
                        ? "bg-primary border-primary text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-heading mb-2 text-xl font-semibold">{t("noProviders")}</p>
            <p className="text-subtext">{t("tryAdjusting")}</p>
          </div>
        </div>
      )}
    </section>
  );
}

