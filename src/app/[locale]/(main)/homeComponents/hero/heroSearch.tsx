"use client";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import Hammer from "@/assets/home/hero/Hammer.svg";
import MapPin from "@/assets/home/hero/MapPin.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFindService from "@/hooks/home/useFindService";
import useCatagory, { Category } from "@/hooks/useCatagory";
import useCity, { City } from "@/hooks/useCity";

export default function HeroSearch() {
  const { search, setSearch, loading, fetchData } = useFindService();
  const { categories, loading: categoriesLoading } = useCatagory();
  const { cities, loading: citiesLoading } = useCity();
  const t = useTranslations("hero.search");
  const params = useParams();
  const locale = params.locale as string;
  
  const isLoading = categoriesLoading || citiesLoading;
  const categoriesList = categories || [];
  const citiesList = cities || [];

  return (
    <div
      className={`md:bg-background grid h-auto w-full grid-cols-1 items-center  gap-3 bg-transparent sm:shadow-black/10 md:h-16 md:w-[95%] md:grid-cols-[1fr_1fr_auto] md:gap-0 md:rounded-full md:shadow-sm`}
      aria-label="Service search form"
    >
      <div
        className={` border-foreground/20 bg-background md:border-background flex h-14 items-center gap-0.5 rounded-lg border  px-4 outline-none md:ml-3 md:mr-0 md:gap-1 md:border-2 md:border-none md:bg-transparent md:bg-none md:px-0 rtl:md:ml-0 rtl:md:mr-3`}
      >
        <Hammer className="text-primary h-4 w-5" aria-hidden="true" />
        <span className="bg-foreground/5 ml-3 mr-0 inline-block h-full w-px md:hidden rtl:ml-0 rtl:mr-3"></span>
        <Select
          value={search.categoryId}
          onValueChange={(value) => setSearch((prev) => ({ ...prev, categoryId: value }))}
        >
          <SelectTrigger
            aria-label="Select service"
            className="text-bold text-heading flex h-14 w-full  cursor-pointer items-center
                  justify-between truncate border-none
                  bg-transparent text-[clamp(12px,1vw,16px)]
                  shadow-none md:h-16 md:w-[max(100px,100%)] md:max-w-[clamp(120px,10vw,200px)]
                  md:focus-visible:ring-0 md:focus-visible:ring-offset-0 rtl:flex-row-reverse
                "
          >
            <SelectValue placeholder={t("selectService")} />
          </SelectTrigger>

          <SelectContent
            className=" bg-background text-heading
                  border-background max-h-[220px] w-[max(90px,90%)]
                  overflow-x-clip  rounded-md border
                  shadow-lg
                "
          >
            {isLoading ? (
              <div className="p-4 text-center text-sm text-subtext">Loading categories...</div>
            ) : categoriesList.length === 0 ? (
              <div className="p-4 text-center text-sm text-subtext">No categories available</div>
            ) : (
              categoriesList.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="hover:bg-foreground/10 cursor-pointer"
                >
                  {(category as Category)[`name_${locale}` as keyof Category]}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div
        className={` border-foreground/20 bg-background md:border-background flex h-14 items-center justify-start gap-px rounded-lg  border px-4 outline-none md:border-2 md:border-none md:bg-transparent md:bg-none md:px-0 `}
      >
        <MapPin className="text-primary h-4 w-5" aria-hidden="true" />
        <span className="bg-foreground/5 ml-3 mr-0 inline-block h-full w-px md:hidden rtl:ml-0 rtl:mr-3"></span>
        <Select
          value={search.cityId}
          onValueChange={(value) => setSearch((prev) => ({ ...prev, cityId: value }))}
        >
          <SelectTrigger
            aria-label="Select city"
            className="text-bold text-heading flex h-14 w-full  cursor-pointer items-center
                  justify-between border-none bg-transparent
                  text-[clamp(12px,1vw,16px)] shadow-none md:h-16 md:w-[max(100px,100%)]
                  md:max-w-[clamp(120px,10vw,200px)]
                  md:focus-visible:ring-0 md:focus-visible:ring-offset-0 rtl:flex-row-reverse
                "
          >
            <SelectValue placeholder={t("selectCity")} />
          </SelectTrigger>

          <SelectContent
            className=" bg-background text-heading
                  border-background max-h-[220px] w-[max(90px,90%)]
                  overflow-x-clip  rounded-md border text-[max(12px,60%)]
                  shadow-lg
                "
          >
            {isLoading ? (
              <div className="p-4 text-center text-sm text-subtext">Loading cities...</div>
            ) : citiesList.length === 0 ? (
              <div className="p-4 text-center text-sm text-subtext">No cities available</div>
            ) : (
              citiesList.map((city) => (
                <SelectItem
                  key={city.id}
                  value={city.id}
                  className="hover:bg-foreground/10 cursor-pointer"
                >
                  {(city as City)[`name_${locale}` as keyof City]}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <button
        onClick={fetchData}
        aria-label="Search for selected service and city"
        className=" bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn duration-600 flex h-12 min-w-14 cursor-pointer items-center  justify-center   gap-2 rounded-lg px-3 text-white md:ml-0   md:mr-1 md:h-14 md:w-14 md:rounded-full lg:w-auto rtl:md:ml-1 rtl:md:mr-0"
      >
        <Search
          className="hidden h-[clamp(12px,1vw,16px)] w-[clamp(12px,1vw,16px)] scale-150 md:block rtl:scale-x-[-1.5]"
          aria-hidden="true"
        />
        <span
          className={`font-roboto block text-[clamp(12px,1vw,16px)] font-normal md:hidden lg:block `}
        >
          {loading ? t("searching") : t("searchNow")}
        </span>
      </button>
    </div>
  );
}
