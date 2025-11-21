"use client";
import Image from "next/image";
import React from "react";

import Edit from "@/assets/providerDashboard/Edit.svg";
import Trash from "@/assets/providerDashboard/Trash.svg";
import { browseByNeed } from "@/utils/constants/homeData";

interface MyServiceCardProps {
  title: string;
  category: string;
  price: number;
  location: string;
  active: boolean | undefined;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MyServiceCard({
  title,
  category,
  price,
  location,
  active,
  onEdit,
  onDelete,
}: MyServiceCardProps) {
  const iconElement = browseByNeed.find((item) => item.name === category);
  return (
    <div className="bg-secondary/10 shadow-foreground/20 flex h-full w-full items-center justify-start gap-5 rounded-2xl p-5 shadow-md">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          {iconElement && (
            <div
              style={{ backgroundColor: iconElement.backgroundColor }}
              className={` flex h-12 w-12 items-center justify-center rounded-xl sm:h-20 sm:w-20`}
            >
              <Image
                src={iconElement.img}
                alt={iconElement.text}
                width={24}
                height={24}
                className="h-4 w-4 sm:h-6 sm:w-6"
              />
            </div>
          )}
          <div className="space-y-1">
            <h4 className="font-roboto text-heading text-[clamp(14px,1vw,18px)] font-semibold">
              {title}
            </h4>

            <div className="font-roboto flex flex-col items-start justify-start gap-1 text-[clamp(10px,1vw,14px)] font-normal text-[#6B7280] md:flex-row md:items-center">
              <p className="font-roboto text-subtext text-[clamp(12px,1vw,16px)] font-normal">
                Starting at {price} MAD.
              </p>
              {location}
            </div>

            <div
              aria-label={active ? "Service is active" : "Service is inactive"}
              className={`${active ? "w-14 bg-[#DCFCE7] text-[#166534]" : "w-18 bg-red-100 text-red-500"} font-inter flex h-6 items-center justify-center rounded-full text-[12px] font-normal`}
            >
              {active ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        <div className="space-x-3 sm:space-x-5">
          <button onClick={onEdit} aria-label={`Edit service ${title}`} className="cursor-pointer">
            <Edit className="w-r h-4" />
          </button>
          <button
            onClick={onDelete}
            aria-label={`Delete service ${title}`}
            className="cursor-pointer"
          >
            <Trash className="w-r h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
