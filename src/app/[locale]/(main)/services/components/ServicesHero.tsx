"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import useCatagory, { Category } from "@/hooks/useCatagory";
import useCity, { City } from "@/hooks/useCity";
import { heroHeading, heroParagraph } from "@/utils/fonts";

import SelectField from "./selectField";

const priceList = [
  { label: "50 MAD", value: "50" },
  { label: "100 MAD", value: "100" },
  { label: "150 MAD", value: "150" },
  { label: "200 MAD", value: "200" },
  { label: "250 MAD", value: "250" },
  { label: "300 MAD", value: "300" },
];

export default function ServicesHero() {
  const categories = useCatagory();
  const cities = useCity();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const t = useTranslations("services.hero");

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [selectedPrice, setSelectedPrice] = useState("");

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedCity(searchParams.get("city") || "");
  }, [searchParams]);

  const filterService = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedCity) params.append("city", selectedCity);
    if (selectedPrice) params.append("min_price", selectedPrice);

    router.push(`/${locale}/services?${params.toString()}`);
  };

  return (
    <div className="bg-secondary" aria-label="Services Hero Section">
      <div className="container py-15 p-5">
        <div className="flex flex-col items-start justify-start gap-4">
          <h1 aria-label="Service Hero Heading" className={`${heroHeading} text-heading`}>
            {t("title")}
          </h1>
          <p aria-label="Service Hero Paragraph" className={`${heroParagraph} text-subtext`}>
            {t("description")}
          </p>

          <div
            aria-label="Filter Services"
            className="flex w-full flex-col gap-3 rounded-xl bg-white p-3 shadow-xl dark:bg-gray-900 md:flex-row"
          >
            {/* Categories Select */}
            <SelectField
              name="category"
              items={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder={t("search.category")}
              getOptionLabel={(c: Category) => c[`name_${locale}` as keyof Category] as string}
              getOptionValue={(c: Category) => c.id}
            />

            {/* Cities Select */}
            <SelectField
              name="city"
              items={cities}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder={t("search.city")}
              getOptionLabel={(c: City) => c[`name_${locale}` as keyof City] as string}
              getOptionValue={(c: City) => c.id}
            />
            <SelectField
              name="price"
              items={priceList}
              value={selectedPrice}
              onChange={setSelectedPrice}
              placeholder={t("search.price")}
              getOptionLabel={(price) => price.label}
              getOptionValue={(price) => price.value}
            />
            <button
              aria-label="Filter Service Button"
              onClick={filterService}
              className="bg-primary hover:bg-btnHover font-roboto h-12 rounded-lg px-6 text-[clamp(12px,1vw,16px)] font-normal text-white transition-colors md:px-10"
            >
              {t("search.filter")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
