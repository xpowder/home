"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import LogButton from "../components/logButton";
import { useSignUpForm } from "../hooks/useSignUpForm";
import OAuthButtons from "./oAuthButtons";
import PasswordInput from "./passwordInpout";
import TextInput from "./textInput";

export default function SignUpForm({ role }: { role: "client" | "provider" }) {
  const params = useParams();
  const locale = params.locale as string;
  const { register, errors, dirtyFields, isSubmitting, onSubmit, formError } = useSignUpForm(role);
  const t = useTranslations("auth.signup");

  return (
    <form
      onSubmit={onSubmit}
      className="my-5 w-full space-y-5"
      aria-label="Sign up form"
      noValidate
    >
      {/* Identifier Input */}
      <TextInput
        label={t("firstName")}
        placeholder={t("firstNamePlaceholder")}
        register={register("first_name")}
        error={errors.first_name}
        dirty={dirtyFields.first_name}
      />
      <TextInput
        label={t("lastName")}
        placeholder={t("lastNamePlaceholder")}
        register={register("last_name")}
        error={errors.last_name}
        dirty={dirtyFields.last_name}
      />
      <TextInput
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        register={register("email")}
        error={errors.email}
        dirty={dirtyFields.email}
      />
      <TextInput
        label={t("phoneNumber")}
        placeholder={t("phoneNumberPlaceholder")}
        register={register("phone")}
        error={errors.phone}
        dirty={dirtyFields.phone}
      />
      {/* Password Input */}
      <PasswordInput
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        register={register("password")}
        error={errors.password}
        dirty={dirtyFields.password}
      />
      <PasswordInput
        label={t("confirmPassword")}
        placeholder={t("confirmPasswordPlaceholder")}
        register={register("confirmPassword")}
        error={errors.confirmPassword}
        dirty={dirtyFields.confirmPassword}
      />

      {/* agree terms and conditions*/}
      <div className="">
        <label className="font-roboto text-subtext flex flex-col gap-2 text-[14px] font-normal sm:flex-row sm:items-center">
          <span className="flex items-center gap-2">
            <input type="checkbox" {...register("agreeToTerms")} aria-required="true" />
            <span className="whitespace-nowrap">{t("agree")}</span>
          </span>
          <span className="flex gap-1 whitespace-nowrap">
            <Link className="text-primary" href="/">
              {t("terms")}
            </Link>
            <span>{t("and")}</span>
            <Link className="text-primary" href={`/${locale}/privacy-policy`}>
              {t("privacy")}
            </Link>
          </span>
        </label>

        {errors.agreeToTerms && (
          <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>
        )}
      </div>

      <LogButton
        isSubmitting={isSubmitting}
        type="submit"
        text={`${isSubmitting ? t("signingup") : t("signup")}`}
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

      <span className="font-roboto text-subtext flex items-center justify-center text-[14px] font-normal">
        {t("alradyHaveAccount")}
        <Link className="text-primary" href="/auth">
          {t("loginHere")}
        </Link>
      </span>
    </form>
  );
}
