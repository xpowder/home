import { ChevronDown } from "lucide-react";
import React from "react";

import MapPin from "@/assets/home/offers/MapPin.svg";
import Money from "@/assets/services/money.svg";

interface SelectFieldProps<T> {
  name: string;
  items: T[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string;
}

export default function SelectField<T>({
  name,
  items,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  getOptionLabel,
  getOptionValue,
}: SelectFieldProps<T>) {
  return (
    <div className={`relative inline-block flex-1 ${className}`}>
      {name === "city" ? (
        <MapPin className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      ) : name === "price" ? (
        <Money className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      ) : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="scrollbar-hide h-12 w-full appearance-none rounded-lg border border-gray-200/50 bg-white px-8 py-2 text-sm outline-none  dark:bg-gray-800"
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {items.map((item) => (
          <option
            className="bg-secondary border-none"
            key={getOptionValue(item)}
            value={getOptionValue(item)}
          >
            {getOptionLabel(item)}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
}
