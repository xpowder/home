import { useTranslations } from "next-intl";
import React from "react";

import Provider from "@/assets/auth/provider.svg";
import User from "@/assets/auth/user.svg";

interface AuthButtonsProps {
  continueAs: "client" | "provider";
  setContinueAs: React.Dispatch<React.SetStateAction<"client" | "provider">>;
  operation: "login" | "sign up";
  setOperation: React.Dispatch<React.SetStateAction<"login" | "sign up">>;
}

export default function AuthButtons({
  continueAs,
  setContinueAs,
  operation,
  setOperation,
}: AuthButtonsProps) {
  const t = useTranslations("auth.authButtons");
  return (
    <div className="space-y-5">
      <div
        className="dark:bg-primary flex h-16 w-full items-center justify-between gap-2 rounded-md bg-[#F3F4F6] px-1 shadow-md"
        role="group"
        aria-label="Select account type"
      >
        <button
          aria-pressed={continueAs === "client"}
          onClick={() => setContinueAs("client")}
          className={`font-roboto text-heading flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-[clamp(10px,1vw,12px)] font-medium transition-colors duration-300
                    ${continueAs === "client" ? "dark:bg-secondary/50 bg-white" : "bg-transparent"}
                
                `}
        >
          <User className="h-4 w-4" />
          {t("Continue as User")}
        </button>

        <button
          aria-pressed={continueAs === "provider"}
          onClick={() => setContinueAs("provider")}
          className={`font-roboto text-heading flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-[clamp(10px,1vw,12px)] font-medium transition-colors duration-300
                    ${continueAs === "client" ? "bg-transparent" : "dark:bg-secondary/50 bg-white"}
                `}
        >
          <Provider className="h-4 w-4" />
          {t("Continue as Provider")}
        </button>
      </div>
      <div
        className="w-dull dark:bg-secondary flex h-12 items-center justify-between gap-2 rounded-md bg-[#F3F4F6] px-1 shadow-md"
        role="group"
        aria-label="Select authentication action"
      >
        <button
          aria-pressed={operation === "login"}
          onClick={() => setOperation("login")}
          className={`font-roboto text-heading flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-[clamp(10px,1vw,12px)] font-medium transition-colors duration-300
                    ${operation === "login" ? "dark:bg-primaryDark/50 bg-white" : "bg-transparent"}
                
                `}
        >
          {t("login")}
        </button>

        <button
          aria-pressed={operation === "sign up"}
          onClick={() => setOperation("sign up")}
          className={`font-roboto text-heading flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-[clamp(10px,1vw,12px)] font-medium transition-colors duration-300
                    ${operation === "sign up" ? "dark:bg-primaryDark/50 bg-white" : "bg-transparent"}
                `}
        >
          {t("sign up")}
        </button>
      </div>
    </div>
  );
}
