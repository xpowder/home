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
    <div className="space-y-4">
      {/* Role Selection Tabs */}
      <div
        className="flex h-12 w-full items-center justify-between gap-2 rounded-lg bg-[#F3F4F6] p-1"
        role="group"
        aria-label="Select account type"
      >
        <button
          type="button"
          aria-pressed={continueAs === "client"}
          onClick={() => setContinueAs("client")}
          className={`font-roboto flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-200
                    ${
                      continueAs === "client"
                        ? "bg-white text-heading shadow-sm"
                        : "bg-transparent text-gray-600"
                    }
                `}
        >
          <User className="h-4 w-4" />
          {t("Continue as User")}
        </button>

        <button
          type="button"
          aria-pressed={continueAs === "provider"}
          onClick={() => setContinueAs("provider")}
          className={`font-roboto flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-200
                    ${
                      continueAs === "provider"
                        ? "bg-white text-heading shadow-sm"
                        : "bg-transparent text-gray-600"
                    }
                `}
        >
          <Provider className="h-4 w-4" />
          {t("Continue as Provider")}
        </button>
      </div>
      
      {/* Auth Mode Tabs */}
      <div
        className="flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-[#F3F4F6] p-1"
        role="group"
        aria-label="Select authentication action"
      >
        <button
          type="button"
          aria-pressed={operation === "login"}
          onClick={() => setOperation("login")}
          className={`font-roboto flex h-full w-full cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium transition-all duration-200
                    ${
                      operation === "login"
                        ? "bg-white text-heading shadow-sm"
                        : "bg-transparent text-gray-600"
                    }
                `}
        >
          Login
        </button>

        <button
          type="button"
          aria-pressed={operation === "sign up"}
          onClick={() => setOperation("sign up")}
          className={`font-roboto flex h-full w-full cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium transition-all duration-200
                    ${
                      operation === "sign up"
                        ? "bg-white text-heading shadow-sm"
                        : "bg-transparent text-gray-600"
                    }
                `}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
