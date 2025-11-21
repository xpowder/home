import React from "react";

import Info from "@/assets/auth/info.svg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InputLabelProps {
  label: string;
  info: string;
}

export default function Inputlabel({ label, info }: InputLabelProps) {
  return (
    <label className="font-poppins text-subtext flex items-center justify-start gap-2 text-[16px] font-semibold">
      {label}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info
              aria-label={`More information about ${label}`}
              className="h-3 w-3 cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{info}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </label>
  );
}
