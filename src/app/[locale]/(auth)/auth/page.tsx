"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

import Logo from "@/assets/header/homezupLogo.svg";
import AuthButtons from "../components/authButtons";
import LoginForm from "../components/loginForm";
import ProviderAuthDecor from "../components/providerAuthDecor";
import SignUpForm from "../components/signupForm";
import UserAuthDecor from "../components/userAuthDecor";

export default function Page() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const role = searchParams.get("role");
  const [continueAs, setContinueAs] = useState<"client" | "provider">(
    role === "provider" ? "provider" : "client"
  );
  const [operation, setOperation] = useState<"login" | "sign up">(
    mode === "sign up" ? "sign up" : "login"
  );
  return (
    <section
      role="main"
      aria-label="Authentication Page"
      className="grid min-h-screen w-full grid-cols-1 bg-white lg:grid-cols-2"
    >
      {/* Left Section - Form */}
      <div className="relative flex min-h-screen flex-col bg-white">
        {/* Logo Header */}
        <div className="p-6 sm:p-8">
          <Link href="/" aria-label="Homezup Logo" className="flex items-center gap-2">
            <Logo
              role="img"
              aria-label="Homezup Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="font-poppins bg-primary bg-clip-text text-2xl font-bold leading-tight text-transparent">
              Homezup
            </span>
          </Link>
        </div>

        {/* Form Container - Centered */}
        <div className="mx-auto flex w-full max-w-[511px] flex-1 items-center justify-center px-5 py-8">
          <div
            role="region"
            aria-label="Authentication Form"
            className="bg-white w-full rounded-xl p-6 sm:p-8 shadow-sm"
          >
            <AuthButtons
              continueAs={continueAs}
              setContinueAs={setContinueAs}
              operation={operation}
              setOperation={setOperation}
            />
            <div className="h-full w-full">
              {operation === "login" ? (
                <LoginForm role={continueAs} />
              ) : (
                <SignUpForm role={continueAs} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-center p-6 sm:p-8">
          <p className="font-roboto text-subtext text-center text-xs font-normal text-gray-500">
            © 2025 Homezup. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Section - Promotional */}
      <div
        role="presentation"
        aria-hidden="true"
        className="bg-primary hidden h-full min-h-screen w-full items-center justify-center overflow-hidden lg:flex"
      >
        {continueAs === "client" ? <UserAuthDecor /> : <ProviderAuthDecor />}
      </div>
    </section>
  );
}
