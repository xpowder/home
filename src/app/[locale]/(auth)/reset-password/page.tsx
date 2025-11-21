"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import authImage from "@/assets/auth/authImage.png";
import Lock from "@/assets/auth/lock.svg";
import Message from "@/assets/auth/message.svg";
import { logger } from "@/lib/logger";
import { requestPasswordReset } from "@/services/auth.services";
import { cardHeading, cardParagraph } from "@/utils/fonts";
import {
  type ResetPasswordSchema,
  resetPasswordSchema,
} from "@/validation/auth/resetPasswordSchema";

// ----------- Types for API responses -----------
export interface ResetPasswordSuccessResponse {
  additionalProp1: Record<string, unknown>;
}

interface ResetPasswordErrorResponse {
  status: string;
  message: string;
  errors: Array<Record<string, string>>;
}

// ----------- Reset Password Page Component -----------
export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    setError,
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const t = useTranslations("auth.resetPassword");

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      await requestPasswordReset(data);
      toast.success("Reset link sent successfully!");
      reset();
    } catch (err) {
      const error = err as AxiosError<ResetPasswordErrorResponse>;
      logger.error("Reset failed:", error);

      // Map backend error message to form field
      setError("email", {
        message: error.response?.data?.message || "Something went wrong. Try again.",
      });

      // Optional toast for additional error info
      toast.error(error.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <section
      className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2"
      role="main"
      aria-label={t("ariaMainLabel")}
    >
      {/* Left Panel: Reset Form */}
      <div className="dark:bg-secondary flex items-center justify-center bg-white p-5">
        <div
          className="bg-background w-full max-w-md space-y-3 rounded-xl p-10 shadow-md shadow-black/20"
          role="region"
          aria-label={t("ariaRegionLabel")}
        >
          <h2 className={`${cardHeading} text-heading`} tabIndex={0}>
            {t("title")}
          </h2>
          <p className={`${cardParagraph} text-subtext`} tabIndex={0}>
            {t("description")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-3">
            <label className="font-poppins text-subtext text-[12px] font-medium" htmlFor="email">
              {t("emailLabel")}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder={t("emailPlaceholder")}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby="email-error"
                className={`font-poppins h-10 w-full rounded-lg border p-3 pr-10 text-[14px] outline-none ${
                  errors.email
                    ? "border-red-500 text-red-600 placeholder:text-red-400"
                    : dirtyFields.email
                      ? "border-green-500 text-green-700"
                      : "border-secondary text-[#ADAEBC]"
                }`}
              />
            </div>

            {errors.email ? (
              <p id="email-error" className="text-xs text-red-500" role="alert">
                {errors.email.message}
              </p>
            ) : dirtyFields.email ? (
              <p className="text-xs text-green-600">{t("emailValid")}</p>
            ) : null}

            <button
              disabled={isSubmitting}
              type="submit"
              className="bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled h-10 w-full cursor-pointer rounded-xl text-[14px] text-white duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
              aria-busy={isSubmitting ? "true" : "false"}
            >
              {isSubmitting ? t("buttonSending") : t("buttonSendLink")}
            </button>
          </form>

          <p className={`${cardParagraph} text-subtext text-center`}>
            {t("supportText")} <span className="text-primary">{t("supportEmail")}</span>
          </p>

          <Link
            className="text-primary flex items-center justify-center text-[14px] font-semibold"
            href="/auth"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </div>

      {/* Right Panel: Decorative */}
      <div
        className="bg-primary hidden h-full w-full items-center justify-center overflow-hidden md:flex"
        role="presentation"
        aria-hidden="true"
      >
        <div className="relative aspect-[.8] w-[70%] min-w-[340px] max-w-[500px] rounded-[60px] border border-white/20 bg-white/20">
          <div
            className="absolute left-[-30px] top-[70%] flex h-16 w-16 items-center justify-center rounded-full bg-white"
            aria-hidden="true"
          >
            <div className="flex items-end justify-center">
              <Lock className="h-6 w-6" />
              <Message className="h-4 w-4" />
            </div>
          </div>

          <Image
            src={authImage}
            alt="Authentication illustration"
            fill
            className="ml-[25%] mr-0 object-contain rtl:ml-0 rtl:mr-[25%] rtl:scale-x-[-1]"
          />

          <div className="relative z-10 space-y-2 p-10">
            <h2
              className="font-poppins w-[75%] text-[calc(12px+1vw)] font-bold text-white"
              tabIndex={0}
            >
              {t("decorTitle")}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
