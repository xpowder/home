"use client";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import CheckCircle2 from "@/assets/auth/CheckCircle2.svg";
import XCircle from "@/assets/auth/XCircle.svg";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  info?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  dirty?: boolean;
}

export default function ProviderTextarea({
  label,
  placeholder,
  register,
  error,
  dirty,
  ...props
}: TextareaProps) {
  return (
    <div className="relative w-full space-y-1">
      <label className="font-poppins flex items-center justify-start gap-2 text-[16px] font-medium text-[#374151]">
        {label}
      </label>

      <div className="relative">
        <textarea
          {...register}
          {...props}
          placeholder={placeholder}
          className={`font-poppins min-h-[100px] w-full resize-none rounded-lg border-[1px] p-3 pr-10 text-[16px]  outline-none ${
            error
              ? "border-red-500 text-red-600 placeholder:text-red-400"
              : dirty
                ? "border-green-500 text-green-700"
                : "border-gray-300 text-[#ADAEBC]"
          }`}
        />

        {error ? (
          <XCircle className="absolute left-auto right-3 top-3 h-4 w-4 text-red-500 rtl:left-3 rtl:right-auto" />
        ) : dirty ? (
          <CheckCircle2 className="absolute left-auto right-3 top-3 h-4 w-4 text-green-500 rtl:left-3 rtl:right-auto" />
        ) : null}
      </div>

      {error ? <p className="text-left text-xs text-red-500">{error.message}</p> : null}
    </div>
  );
}
