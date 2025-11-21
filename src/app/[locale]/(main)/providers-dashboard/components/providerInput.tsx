"use client";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import CheckCircle2 from "@/assets/auth/CheckCircle2.svg";
import XCircle from "@/assets/auth/XCircle.svg";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  info?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn; // the return of register("fieldName")
  error?: FieldError;
  dirty?: boolean;
}

export default function ProviderInput({
  label,

  placeholder,
  register,
  error,
  dirty,
  ...props
}: TextInputProps) {
  const inputId = `${register?.name || label.replace(/\s+/g, "-").toLowerCase()}-input`;
  const errorId = `${inputId}-error`;
  return (
    <div className="relative w-full space-y-1">
      <label
        htmlFor={inputId}
        className="font-poppins flex items-center justify-start gap-2 text-[16px] font-medium text-[#374151]"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...register}
          {...props}
          placeholder={placeholder}
          className={`font-poppins h-12 w-full rounded-lg border-[1px] p-3 text-[14px] outline-none  ${
            error
              ? "border-red-500 text-red-600 placeholder:text-red-400"
              : dirty
                ? "border-green-500 text-green-700"
                : "border-gray-300 text-[#ADAEBC]"
          }`}
        />
        {error ? (
          <XCircle
            aria-hidden="true"
            className="absolute left-auto right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500 rtl:left-3 rtl:right-auto"
          />
        ) : dirty ? (
          <CheckCircle2
            aria-hidden="true"
            className="absolute left-auto right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500 rtl:left-3 rtl:right-auto"
          />
        ) : null}
      </div>
      {error ? <p className="text-left text-xs text-red-500">{error.message}</p> : null}
    </div>
  );
}
