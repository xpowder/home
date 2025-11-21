import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { ReactNode } from "react";

interface MyPerformanceProps {
  title: string;
  count: number;
  countWeek: number;
  positive: boolean;
  percent: number;
  bg: string;
  icon: ReactNode;
}

export default function MyPerformanceCard({
  title,
  count,
  countWeek,
  positive,
  percent,
  bg,
  icon,
}: MyPerformanceProps) {
  const t = useTranslations("providersDashboard.performances");
  return (
    // Main card container
    <div
      role="region"
      aria-label={`${title} performance statistics`}
      className="flex h-full w-full items-center justify-between  rounded-xl border border-gray-200 px-8 py-5 dark:border-gray-800"
    >
      <div className="space-y-2">
        <div
          aria-hidden="true"
          className={`${bg} flex h-[clamp(40px,2vw,48px)] w-[clamp(40px,2vw,48px)] items-center justify-center rounded-xl `}
        >
          {icon && <span className="rtl:scale-x-[-1]">{icon}</span>}
        </div>
        <h2
          aria-label={`Current ${title} is ${count}`}
          className="font-inter text-heading text-[clamp(18px,1vw,24px)] font-bold"
        >
          {count}
        </h2>
        <h4
          aria-label={`Performance metric: ${title}`}
          className="font-roboto text-[clamp(12px,1vw,16px)] font-normal text-[#4B5563] dark:text-white"
        >
          {title}
        </h4>
        <p
          aria-label={`This week's ${title} count: ${countWeek}`}
          className="font-roboto text-[clamp(12px,1vw,16px)] font-normal text-[#6B7280]  dark:text-white"
        >
          {t("thisWeek")} :{countWeek}
        </p>
      </div>
      <div
        aria-label={`${title} ${
          positive ? "Increased" : "Decreased"
        } by ${percent} percent compared to last week`}
        className={`${positive ? "text-[#16A34A]" : "text-[#DC2626]"} font-roboto flex items-center justify-center gap-1 self-start text-[clamp(12px,1vw,16px)] font-medium `}
      >
        {positive ? <ArrowUp className="h-3 w-3 " /> : <ArrowDown className="h-3 w-3 " />}
        <span>{percent}%</span>
      </div>
    </div>
  );
}
