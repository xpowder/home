import React from "react";

interface HhwCardProps {
  step: string;
  title: string;
  description: string;
}

export default function HhwCard({ step, title, description }: HhwCardProps) {
  return (
    <div className="shadow-foreground/20 border-foreground/10 flex h-full w-full flex-col items-center justify-center rounded-2xl border-[.5px] px-5 py-10 shadow-md lg:max-w-[310px] xl:h-64 xl:max-w-[380px] xl:py-0">
      <div className="bg-primaryDark font-roboto flex h-12 w-12 items-center justify-center rounded-full text-[22px] font-bold text-white">
        {step}
      </div>
      <h3
        className={`font-poppins text-heading mt-4 text-[clamp(14px,3vw,18px)]   font-semibold leading-7`}
      >
        {title}
      </h3>
      <p
        className={`font-roboto text-subtext mb-4  mt-2 w-[250px] text-center text-[clamp(12px,3vw,16px)] font-normal md:w-[300px]`}
      >
        {description}
      </p>
    </div>
  );
}
