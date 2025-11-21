"use client";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import CheckCircle2 from "@/assets/auth/CheckCircle2.svg";
import XCircle from "@/assets/auth/XCircle.svg";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
  register: UseFormRegisterReturn; // the return of register("fieldName")
  error?: FieldError;
  dirty?: boolean;
}

export default function TextInput({
  label,
  placeholder,
  register,
  error,
  dirty,
  ...props
}: TextInputProps) {
  const inputId = `${register.name}-input`; // unique id for label and input
  const errorId = `${register.name}-error`;
  return (
    <div className="relative space-y-1">
      <label htmlFor={inputId} className="font-poppins text-subtext text-[12px] font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-label={label} // screen reader label
          aria-invalid={!!error} // accessibility: indicate error state
          aria-describedby={error ? errorId : undefined} // link to error text
          {...register}
          {...props}
          placeholder={placeholder}
          className={`font-poppins h-10 w-full rounded-lg border-[1px] p-3 pr-10 text-[14px] outline-none ${
            error
              ? "border-red-500 text-red-600 placeholder:text-red-400"
              : dirty
                ? "border-green-500 text-green-700"
                : "border-secondary text-[#ADAEBC]"
          }`}
        />
        {error ? (
          <XCircle
            aria-hidden="true"
            className="absolute left-auto right-3 top-1/2 h-4  w-4 -translate-y-1/2 text-red-500 rtl:left-3 rtl:right-auto"
          />
        ) : dirty ? (
          <CheckCircle2
            aria-hidden="true"
            className="absolute left-auto right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500 rtl:left-3 rtl:right-auto"
          />
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-500">{error.message}</p> : null}
    </div>
  );
}
