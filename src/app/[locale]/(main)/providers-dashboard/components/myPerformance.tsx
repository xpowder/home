"use client";
import { useTranslations } from "next-intl";
import React from "react";

import CallAmber from "@/assets/providerDashboard/CallAmber.svg";
import EyeBlue from "@/assets/providerDashboard/EyeBlue.svg";
import Message from "@/assets/providerDashboard/Message.svg";
// import HeartPurple from "@/assets/providerDashboard/HeartPurple.svg"
import ThunderWhite from "@/assets/providerDashboard/ThunderWhite.svg";
import { cardHeading } from "@/utils/fonts";
const data = [
  {
    title: "titles.t1",
    count: 107,
    countWeek: 89,
    positive: true,
    percent: 12,
    bg: "bg-primaryLight",
    icon: <EyeBlue className="h-[clamp(16px,1vw,24px)] min-h-4 w-[clamp(16px,1vw,24px)] min-w-4" />,
  },
  {
    title: "titles.t2",
    count: 28,
    countWeek: 7,
    positive: true,
    percent: 8,
    bg: "bg-[#DCFCE7]",
    icon: <Message className="h-[clamp(16px,1vw,24px)] min-h-4 w-[clamp(16px,1vw,24px)] min-w-4" />,
  },
  {
    title: "titles.t3",
    count: 67,
    countWeek: 18,
    positive: true,
    percent: 15,
    bg: "bg-[#FFEDD5]",
    icon: (
      <CallAmber className="h-[clamp(16px,1vw,24px)] min-h-4 w-[clamp(16px,1vw,24px)] min-w-4" />
    ),
  },
];

import EngagementCard from "./myPerformanceCard";

export default function MyPerformance() {
  const t = useTranslations("providersDashboard.performances");
  return (
    <section aria-label="User performance overview" className="my-8 px-5 md:my-16">
      <div className="container  space-y-8">
        <div className="flex items-center justify-between">
          <h2 className={`${cardHeading} text-heading`}>{t("title")}</h2>
          <button
            aria-label="Boost Visibility"
            className="bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-[40px] min-w-[40px] cursor-pointer items-center justify-center gap-2 rounded-xl p-5 text-white shadow-md shadow-black/10 duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
          >
            <ThunderWhite className="h-4 w-4" />
            <span className="hidden md:block">{t("actionButton")}</span>
          </button>
        </div>
        <div role="list" className="flex flex-col items-center justify-around gap-10 md:flex-row ">
          {data.map((item, idx) => (
            <EngagementCard
              key={idx}
              title={t(item.title)}
              count={item.count}
              countWeek={item.countWeek}
              positive={item.positive}
              percent={item.percent}
              bg={item.bg}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
