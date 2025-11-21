"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import Exit from "@/assets/auth/exit.svg";
import { useAuth } from "@/store/AuthContext";
import { cardHeading, cardParagraph } from "@/utils/fonts";

// ----------- Types for API Responses -----------
export interface LogoutSuccessResponse {
  additionalProp1: Record<string, unknown>;
}

// ----------- Component -----------
export default function LogOut() {
  const router = useRouter();
  const { logout } = useAuth();
  const t = useTranslations("auth.logout");

  const handleLogout = async () => {
    await logout();
    router.push("/logged-out");
  };

  return (
    <section
      className="bg-secondary flex min-h-screen w-full items-center justify-center"
      role="main"
      aria-label={t("ariaMainLabel")}
    >
      <div className="bg-secondary flex flex-col items-center justify-center p-5">
        <div
          className="bg-background shadow-foreground/20 flex flex-col items-center justify-center gap-5 rounded-xl p-10 text-center shadow-md"
          role="region"
          aria-labelledby="logout-title"
          aria-describedby="logout-desc"
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]"
            aria-hidden="true"
          >
            <Exit className="h-4 w-4" />
          </div>

          <h2 id="logout-title" className={`${cardHeading} text-heading`} tabIndex={0}>
            {t("title")}
          </h2>

          <p id="logout-desc" className={`${cardParagraph} text-subtext`} tabIndex={0}>
            {t("description")} <br className="hidden md:block" /> {t("accessYourAccount")}
          </p>

          <div className="flex w-full items-center justify-center gap-5">
            <button
              onClick={() => router.push("/")}
              type="button"
              className="disabled:bg-btnDisabled flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F3F4F6] px-5 text-[14px] text-[#374151] duration-300 hover:-translate-y-px hover:bg-[#E5E7EB] hover:shadow-xl active:bg-[#C9C9C9] active:shadow-sm disabled:text-[#E5E5E5]"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleLogout}
              type="button"
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#DC2626] px-5 text-[14px] text-white duration-300 hover:-translate-y-px hover:bg-[#C62828] hover:shadow-xl active:bg-[#B71C1C] active:shadow-sm disabled:bg-[#F8D7DA] disabled:text-[#9CA3AF]"
            >
              {t("confirmLogout")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
