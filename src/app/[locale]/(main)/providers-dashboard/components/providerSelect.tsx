"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProviderSelectProps {
  label: string;
  info?: string;
  placeholder?: string;
  options: string[];
  register?: UseFormRegisterReturn;
  error?: FieldError;
  dirty?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function ProviderSelect({
  label,
  placeholder,
  options,
  error,
  dirty,
  value,
  onChange,
}: ProviderSelectProps) {
  const selectId = `${label.replace(/\s+/g, "-").toLowerCase()}-select`;
  const errorId = `${selectId}-error`;
  return (
    <div className="relative w-full space-y-1">
      <label
        htmlFor={selectId}
        className="font-poppins flex items-center justify-start gap-2 text-[16px] font-medium text-[#374151]"
      >
        {label}
      </label>

      <div className="relative ">
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger
            id={selectId}
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`py-5.5 font-poppins flex w-full items-center justify-between rounded-lg border-[1px] text-[14px]  rtl:flex-row-reverse ${
              error
                ? "border-red-500 text-red-600"
                : dirty
                  ? "border-green-500 text-green-700"
                  : "border-gray-300 text-[#374151]"
            }`}
          >
            <SelectValue
              placeholder={placeholder || "Select an option"}
              className="flex h-[48px] items-center px-3"
            />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground h-50 border-none">
            {options.map((option) => (
              <SelectItem key={option} value={option} className="hover:bg-foreground/30">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? <p className="text-left text-xs text-red-500">{error.message}</p> : null}
    </div>
  );
}
