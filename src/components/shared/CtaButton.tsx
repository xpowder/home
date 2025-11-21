import React from "react";

interface CtaButtonProps {
  text: string;
  onclick: () => void;
}

export default function CtaButton({ text, onclick }: CtaButtonProps) {
  return (
    <button
      type="button"
      onClick={onclick}
      aria-label="Book a home service now"
      className={`font-poppins md:w-50 shadow-background/10 h-12 w-full cursor-pointer rounded-md border-[#374151] bg-white text-[14px] font-semibold leading-[140%] text-[#1F2937] shadow-md  duration-300 hover:-translate-y-px hover:bg-[#F9FAFB] focus:ring-gray-300 active:bg-[#F3F4F6] disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] md:text-[18px]`}
    >
      {text}
    </button>
  );
}
