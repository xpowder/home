"use client";

import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import GoOut from "@/assets/auth/GoOut.svg";
import Message from "@/assets/auth/message.svg";
import { resendVerification } from "@/services/auth.services";
import { cardHeading, cardParagraph, sectionParagraph } from "@/utils/fonts";

import ProviderAuthDecor from "../components/providerAuthDecor";

export interface SuccessResponse {
  additionalProp1?: object | string;
  message?: string;
}

interface ErrorResponse {
  status: string;
  message: string;
  errors?: Array<Record<string, string>>;
}

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  // const token = searchParams.get("token");
  const t = useTranslations("auth.emailVerification");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (searchParams.has("email")) {
      toast.success(t("toastInitiated"));
    }
  }, [searchParams, t]);

  // Resend verification email
  const handleResend = async () => {
    if (!email) return;

    setResendLoading(true);
    try {
      const res = await resendVerification(email);
      toast.success(res.data.message || t("emailVerifiedMessage"));
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;

      const msg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.email ||
        t("resendErrorDefault");

      setMessage(msg);
      setStatus("error");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section
      className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2"
      role="main"
      aria-label={t("ariaMainLabel")}
    >
      {/* Left Panel */}
      <div className="dark:bg-secondary flex flex-col items-center justify-center gap-4 bg-white p-5">
        <div
          className="bg-background flex flex-col items-center justify-center gap-3 rounded-xl p-10 text-center shadow-md shadow-black/20"
          role="region"
          aria-label={t("ariaInstructionsLabel")}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-md bg-[#76C2FF]/10"
            aria-hidden="true"
          >
            <Message className="h-6 w-6" />
          </div>

          <h2 className={`${cardHeading} text-heading`} tabIndex={0}>
            {status === "success" ? t("emailVerifiedTitle") : t("checkYourEmailTitle")}
          </h2>

          <p className={`${cardParagraph} text-subtext`} tabIndex={0}>
            {status === "success" ? message : t("checkYourEmailMessage")}
          </p>

          <button
            onClick={() => window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")}
            type="button"
            className="bg-primary hover:bg-btnHover active:bg-btnPressed focus:ring-primary/50 disabled:bg-btnDisabled flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-[14px] text-white duration-300 hover:translate-y-[-1px] hover:shadow-xl focus:ring-2 active:shadow-sm disabled:text-[#E5E5E5]"
            aria-label={t("ariaOpenEmailApp")}
          >
            <GoOut className="h-4 w-4" />
            {t("openEmailApp")}
          </button>

          {status !== "success" && (
            <p className={`${sectionParagraph} text-subtext text-center`}>
              {t("didNotReceive")}{" "}
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-primary hover:text-btnHover underline transition-colors"
              >
                {resendLoading ? t("resending") : t("resendVerification")}
              </button>
            </p>
          )}

          <p className={`${cardParagraph} text-subtext`} tabIndex={0}>
            {t("checkSpam")}
          </p>
        </div>

        <p className={`${sectionParagraph} text-subtext text-center`}>
          {t("wrongEmail")}{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-primary hover:text-btnHover underline transition-colors"
          >
            {t("goBackUpdate")}
          </button>
        </p>
      </div>

      {/* Right Panel */}
      <div
        className="bg-primary hidden h-full w-full items-center justify-center overflow-hidden md:flex"
        role="presentation"
        aria-hidden="true"
      >
        <ProviderAuthDecor />
      </div>
    </section>
  );
}
