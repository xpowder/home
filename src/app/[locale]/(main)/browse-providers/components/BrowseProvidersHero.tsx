"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import useCatagory, { Category } from "@/hooks/useCatagory";
import useCity, { City } from "@/hooks/useCity";
import { heroHeading, heroParagraph } from "@/utils/fonts";
import SelectField from "../../services/components/selectField";

const priceRanges = [
  { label: "50 MAD", value: "50" },
  { label: "100 MAD", value: "100" },
  { label: "150 MAD", value: "150" },
  { label: "200 MAD", value: "200" },
  { label: "250 MAD", value: "250" },
  { label: "300 MAD", value: "300" },
  { label: "500 MAD", value: "500" },
  { label: "1000 MAD", value: "1000" },
];

const minimumRatings = [
  { label: "4.5+", value: "4.5" },
  { label: "4.0+", value: "4.0" },
  { label: "3.5+", value: "3.5" },
  { label: "3.0+", value: "3.0" },
  { label: "2.5+", value: "2.5" },
  { label: "2.0+", value: "2.0" },
];

export default function BrowseProvidersHero() {
  const { categories } = useCatagory();
  const { cities } = useCity();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const t = useTranslations("browseProviders.hero");

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || ""
  );
  const [selectedPrice, setSelectedPrice] = useState(
    searchParams.get("min_price") || ""
  );
  const [selectedRating, setSelectedRating] = useState(
    searchParams.get("min_rating") || ""
  );

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedCity(searchParams.get("city") || "");
    setSelectedPrice(searchParams.get("min_price") || "");
    setSelectedRating(searchParams.get("min_rating") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedCity) params.append("city", selectedCity);
    if (selectedPrice) params.append("min_price", selectedPrice);
    if (selectedRating) params.append("min_rating", selectedRating);

    // Scroll to results section
    router.push(`/${locale}/browse-providers?${params.toString()}`);
    
    // Small delay to allow navigation, then scroll
    setTimeout(() => {
      const resultsSection = document.getElementById("all-providers-section");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="bg-secondary" aria-label="Browse Providers Hero Section">
      <div className="container py-15 mx-auto px-5">
        <div className="flex flex-col items-start justify-start gap-4">
          <h1
            aria-label="Browse Providers Hero Heading"
            className={`${heroHeading} text-heading text-3xl md:text-4xl lg:text-5xl font-bold`}
          >
            {t("title")}
          </h1>
          <p
            aria-label="Browse Providers Hero Paragraph"
            className={`${heroParagraph} text-subtext text-base md:text-lg`}
          >
            {t("description")}
          </p>

          <div
            aria-label="Filter Providers"
            className="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-xl dark:bg-gray-900 md:flex-row md:items-center"
          >
            {/* Categories Select */}
            <SelectField
              name="category"
              items={[{ id: "", name_en: "", name_fr: "", name_ar: "" } as Category, ...(categories || [])]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder={t("filters.category")}
              getOptionLabel={(c: Category) => 
                c.id === "" 
                  ? t("filters.category") 
                  : (c[`name_${locale}` as keyof Category] as string) || c.name_en || ""
              }
              getOptionValue={(c: Category) => c.id}
            />

            {/* Cities Select */}
            <SelectField
              name="city"
              items={[{ id: "", name_en: "", name_fr: "", name_ar: "" } as City, ...(cities || [])]}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder={t("filters.city")}
              getOptionLabel={(c: City) => 
                c.id === "" 
                  ? t("filters.city") 
                  : (c[`name_${locale}` as keyof City] as string) || c.name_en || ""
              }
              getOptionValue={(c: City) => c.id}
            />

            {/* Price Range Select */}
            <SelectField
              name="price"
              items={priceRanges}
              value={selectedPrice}
              onChange={setSelectedPrice}
              placeholder={t("filters.priceRange")}
              getOptionLabel={(price) => price.label}
              getOptionValue={(price) => price.value}
            />

            {/* Minimum Rating Select */}
            <SelectField
              name="rating"
              items={minimumRatings}
              value={selectedRating}
              onChange={setSelectedRating}
              placeholder={t("filters.minimumRating")}
              getOptionLabel={(rating) => rating.label}
              getOptionValue={(rating) => rating.value}
            />

            <button
              aria-label="Find Experts Button"
              onClick={handleSearch}
              className="bg-primary hover:bg-btnHover font-roboto h-12 whitespace-nowrap rounded-lg px-8 text-base font-semibold text-white transition-colors md:px-10"
            >
              {t("findExperts")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

