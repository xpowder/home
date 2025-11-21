import "@/styles/browseByNeed.css";

import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { browseByNeed } from "@/utils/constants/homeData";
import { cardParagraph } from "@/utils/fonts";

export default async function SmoothAutoScroll() {
  const t = await getTranslations("browseByNeed.categories");
  return (
    <div
      className="slider"
      style={
        {
          // match your item height 112px prev
          "--quantity": browseByNeed.length, // how many items
        } as React.CSSProperties
      }
    >
      <div className="list">
        {browseByNeed.map((item, index) => {
          const query = new URLSearchParams({ category: item.text.toLocaleLowerCase() }).toString();

          return (
            <Link
              key={index}
              href={`/services?${query}`}
              style={{ "--position": index + 1 } as React.CSSProperties}
              className="item flex flex-col items-center justify-center gap-2 rounded-lg p-2"
            >
              <div
                style={{ backgroundColor: item.backgroundColor }}
                className="flex h-[60px]  w-[60px] items-center justify-center rounded-xl md:h-[75px] md:w-[75px]"
              >
                <Image
                  src={item.img}
                  alt={item.text}
                  width={28}
                  height={28}
                  className="h-[21px] w-[21px] md:h-7 md:w-7"
                  priority
                />
              </div>
              <p className={`${cardParagraph}  text-subtext text-center`}>{t(`${item.text}`)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
