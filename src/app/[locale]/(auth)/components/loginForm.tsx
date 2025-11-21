"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import LogButton from "../components/logButton";
import { useLoginForm } from "../hooks/useLoginForm";
import OAuthButtons from "./oAuthButtons";
import PasswordInput from "./passwordInpout";
import TextInput from "./textInput";

export default function LoginForm({ role }: { role: "client" | "provider" }) {
  const { register, errors, dirtyFields, isSubmitting, onSubmit, formError } = useLoginForm();
  const t = useTranslations("auth.login");

  return (
    <form onSubmit={onSubmit} className="my-5 space-y-5" aria-label="Login form" noValidate>
      {/* Identifier Input */}
      <TextInput
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        register={register("email")}
        error={errors.email}
        dirty={dirtyFields.email}
      />
      {/* Password Input */}
      <PasswordInput
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        register={register("password")}
        error={errors.password}
        dirty={dirtyFields.password}
      />

      {/* Remember Me + Forgot */}
      <div className="flex items-center justify-between">
        <label className="font-roboto text-subtext flex items-center gap-2 text-[14px] font-normal">
          <input type="checkbox" aria-label="Remember me for next login" /> {t("rememberMe")}
        </label>
        <Link href="/reset-password" className="font-roboto text-primary text-[14px] font-normal">
          {t("forgotPassword")}
        </Link>
      </div>

      <LogButton
        isSubmitting={isSubmitting}
        type="submit"
        text={isSubmitting ? t("loggingIn") : t("login")}
      />

      {formError && <p className="mt-2 text-center text-sm text-red-500">{formError}</p>}

      {/* Divider */}
      <div
        role="separator"
        aria-label="Continue with social login"
        className="font-roboto flex items-center justify-center text-[14px] font-normal text-[#6B7280]"
      >
        <div className="bg-secondary h-px flex-1" />
        <span className="mx-2 whitespace-nowrap">{t("orContinueWith")}</span>
        <div className="bg-secondary h-px flex-1" />
      </div>

      {/* OAuth Buttons */}
      <OAuthButtons role={role} />
    </form>
  );
}
