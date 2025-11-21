import React from "react";

interface InputLabelProps {
  label: string;
}

export default function Inputlabel({ label }: InputLabelProps) {
  return (
    <label
      aria-label={label}
      className="font-poppins flex items-center justify-start gap-2 text-[16px] font-medium text-[#374151]"
    >
      {label}
    </label>
  );
}
