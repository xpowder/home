"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

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
  const [showPassword, setShowPassword] = useState(false);
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
          type={showPassword ? "text" : "password"}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...register}
          {...props}
          className={`font-poppins h-10 w-full rounded-lg border-[1px] p-3 ${error ? "pr-20" : "pr-10"} text-[14px] outline-none ${
            error
              ? "border-red-500 text-red-600 placeholder:text-red-400"
              : "border-secondary text-[#ADAEBC]"
          }`}
        />
        {/* Error icon - positioned to the left of eye icon when present */}
        {error && (
          <XCircle
            aria-hidden="true"
            className="absolute left-auto right-11 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500 rtl:left-11 rtl:right-auto"
          />
        )}
        {/* Eye icon button - always visible */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute left-auto right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none rtl:left-3 rtl:right-auto"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p className="max-w-[300px] text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
}
