"use client";
import React from "react";

import useComingSoonAlert from "@/hooks/useCommingSoonAlert";

interface IconButtonProps {
  text: string;
  bg: string;
  direction?: boolean;
  icon?: React.ReactNode; // any Lucide icon component instance
  onClick?: () => void;
}

export default function SectionButton({
  text,
  icon,
  direction = false,
  bg,
  onClick,
}: IconButtonProps) {
  const showCommingSoon = useComingSoonAlert();
  return (
    <button
      aria-label={text}
      type="button"
      onClick={onClick ? onClick : showCommingSoon}
      className={`${bg} ${direction ? "flex-row-reverse" : "flex-row"} bg-btn hover:bg-btnHover  active:bg-btnPressed focus:bg-btn focus:ring-btn  disabled:bg-btnDisabled flex h-12 w-[max(18%,210px)] cursor-pointer items-center justify-center gap-2 rounded-full text-white shadow-md shadow-black/10 duration-300 hover:-translate-y-px hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]`}
    >
      <span className={`font-poppins text-[80%] font-semibold leading-[100%]`}>{text}</span>
      {icon && <span className="rtl:scale-x-[-1]">{icon}</span>}
    </button>
  );
}
