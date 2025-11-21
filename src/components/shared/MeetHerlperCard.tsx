"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import MapPin from "@/assets/home/offers/MapPin.svg";
import Star from "@/assets/home/offers/Star.svg";
import VerifiedIcon from "@/assets/home/offers/VerifiedIcon.svg";
import { HelperCard } from "@/types/home/meetHelpersType";

interface MeetHelperCardProps {
  data: HelperCard & { providerId?: string };
}

export default function MeetHelperCard({ data }: MeetHelperCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  const href = data.providerId ? `/${locale}/services/${data.providerId}` : "#";

  const CardContent = (
    <div
      aria-label={`Offer card for: ${data.category[0] || "Service"} `}
      className="bg-background shadow-foreground/10 duration-400 flex h-full w-[clamp(200px,20vw,258px)] flex-col items-center justify-between rounded-xl p-0 shadow-sm transition-transform hover:scale-105"
    >
      <div className="relative aspect-[1.05] w-[clamp(200px,20vw,258px)] p-0">
        <Image
          src={data.img}
          alt={`Image of Service Provider ${data.name}`}
          fill
          className="rounded-t-xl object-cover "
          priority
        />
      </div>
      <div className="h-full w-full p-2">
        <div className="flex items-center gap-2">
          <h3
            className={`font-poppins text-heading overflow-x-hidden text-ellipsis   whitespace-nowrap text-[clamp(14px,3vw,18px)] font-semibold leading-7  `}
          >
            {data.name}
          </h3>
          <VerifiedIcon className="text-foreground fill-primary h-3 w-3 " />
        </div>

        <div className="flex w-full items-center justify-between">
          <h4
            aria-label={`Name: ${data.name}`}
            className={`font-roboto text-heading text-[clamp(10px,1.5vw,12px)] font-semibold leading-7`}
          >
            {data.jobDone}
          </h4>
          <div
            aria-label={`provider Location ${data.location}`}
            className={`font-roboto text-heading flex items-center gap-1 text-[clamp(10px,1.5vw,12px)] font-semibold`}
          >
            <MapPin className="h-3 w-3" />
            <span>{data.location}</span>
          </div>
        </div>

        <div className="flex w-full items-center justify-between">
          <h4
            aria-label={`Rating: ${data.rating}`}
            className={`font-roboto text-heading text-[clamp(10px,1.5vw,12px)] font-semibold leading-7`}
          >
            Ratings
          </h4>
          <div className="flex items-center justify-center gap-1 text-[clamp(10px,1.5vw,12px)] font-semibold">
            <Star className="text-supporting fill-supporting h-3 w-3" />
            <span className="text-heading">{data.rating}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center  gap-1 ">
          {data.category?.map((item, index) => (
            <span
              key={index}
              className={`font-roboto text-heading rounded-full px-2 text-[clamp(10px,30%,14px)]  font-bold  leading-7`}
              style={{
                backgroundColor: `${data.color}1A`, // 10% opacity in hex
                color: data.color,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (data.providerId) {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
