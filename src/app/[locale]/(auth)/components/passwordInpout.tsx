"use client";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import AlertTriangle from "@/assets/auth/AlertTriangle.svg";
import XCircle from "@/assets/auth/XCircle.svg";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegisterReturn; // the return of register("fieldName")
  error?: FieldError;
  dirty?: boolean;
}

export default function PasswordInput({
  label,
  register,
  error,
  dirty,
  ...props
}: PasswordInputProps) {
  const inputId = `${register.name}-password`;
  const errorId = `${inputId}-error`;
  return (
    <div className="relative space-y-1">
      <label htmlFor={inputId} className="font-poppins text-subtext text-[12px] font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="password"
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...register}
          {...props}
          className={`font-poppins h-10 w-full rounded-lg border-[1px] p-3 pr-10 text-[14px] outline-none ${
            error
              ? "border-red-500 text-red-600 placeholder:text-red-400"
              : dirty
                ? "border-yellow-400 text-yellow-700"
                : "border-secondary text-[#ADAEBC]"
          }`}
        />
        {error ? (
          <XCircle
            aria-hidden="true"
            className="absolute left-auto right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500 rtl:left-3 rtl:right-auto"
          />
        ) : dirty ? (
          <AlertTriangle
            aria-hidden="true"
            className="absolute left-auto right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500 rtl:left-3 rtl:right-auto"
          />
        ) : null}
      </div>
      {error ? (
        <p className="max-w-[300px] text-xs text-red-500">{error.message}</p>
      ) : dirty ? (
        <p className="text-xs text-yellow-600">Password should be at least 8 characters long</p>
      ) : null}
    </div>
  );
}
