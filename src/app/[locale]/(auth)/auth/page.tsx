"use client";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

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
      role="main" // ARIA role for the main content of the page
      aria-label="Authentication Page"
      className="dark:bg-secondary grid min-h-screen w-full grid-cols-1 bg-white lg:grid-cols-2 "
    >
      <div className="dark:bg-secondary mx-auto flex w-[511px] items-center justify-center bg-white  p-5">
        {/* form container */}
        <div
          role="region"
          aria-label="Authentication Form"
          className="bg-background w-full rounded-md p-5 shadow-md shadow-black/20"
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
      {/* Decorative  */}
      <div
        role="presentation"
        aria-hidden="true"
        className="bg-primary  hidden h-full w-full items-center justify-center overflow-hidden lg:flex"
      >
        {continueAs === "client" ? <UserAuthDecor /> : <ProviderAuthDecor />}
      </div>
    </section>
  );
}
