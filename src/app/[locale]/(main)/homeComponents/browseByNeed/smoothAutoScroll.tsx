"use client";
import "@/styles/browseByNeed.css";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import useCatagory from "@/hooks/useCatagory";
import { cardParagraph } from "@/utils/fonts";

export default function SmoothAutoScroll() {
  const { categories, loading } = useCatagory();
  const t = useTranslations("browseByNeed.categories");
  const params = useParams();
  const locale = params.locale as string;

  // Map categories to browse by need format
  const categoryItems = categories.map((category, index) => {
    const categoryName = category[`name_${locale}` as keyof typeof category] || category.name_en;
    const backgroundColor = `hsl(${(index * 30) % 360}, 70%, 90%)`; // Generate colors
    
    return {
      id: category.id,
      name: categoryName,
      backgroundColor,
      img: `/home/browseByNeedImages/c${(index % 22) + 1}.png`, // Cycle through available images
    };
  });

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-subtext">Loading categories...</div>
      </div>
    );
  }

  if (categoryItems.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-subtext">No categories available</div>
      </div>
    );
  }

  return (
    <div
      className="slider"
      style={
        {
          "--quantity": categoryItems.length,
        } as React.CSSProperties
      }
    >
      <div className="list">
        {categoryItems.map((item, index) => {
          const query = new URLSearchParams({ category: item.id }).toString();

          return (
            <Link
              key={item.id}
              href={`/${locale}/services?${query}`}
              style={{ "--position": index + 1 } as React.CSSProperties}
              className="item flex flex-col items-center justify-center gap-2 rounded-lg p-2 transition-transform hover:scale-105"
            >
              <div
                style={{ backgroundColor: item.backgroundColor }}
                className="flex h-[60px] w-[60px] items-center justify-center rounded-xl md:h-[75px] md:w-[75px]"
              >
                <Image
                  src={item.img}
                  alt={item.name}
                  width={28}
                  height={28}
                  className="h-[21px] w-[21px] md:h-7 md:w-7"
                  priority
                />
              </div>
              <p className={`${cardParagraph} text-subtext text-center text-xs md:text-sm`}>
                {item.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
