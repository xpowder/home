"use client";

import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import Google from "@/assets/auth/google.svg";
import { logger } from "@/lib/logger";
import { secureStorage } from "@/lib/secureStorage";
import { loginWithGoogle } from "@/services/auth.services";
// -------------------- Backend Response Interfaces --------------------

// Success response (200)
interface AuthSuccessResponse {
  status: string; // usually "success"
  access_token: string;
  refresh_token: string;
  role: "client" | "provider";
  user_id: string;
}

// Client error (400)
interface AuthBadRequestResponse {
  status: string; // usually "error"
  message: string;
  errors?: Record<string, string>[]; // array of field errors
}

// Server error (500)
interface AuthServerErrorResponse {
  status: string; // usually "error"
  message: string;
  errors?: Record<string, string>[]; // array of field errors
}

// Union type
export type GoogleAuthResponse =
  | AuthSuccessResponse
  | AuthBadRequestResponse
  | AuthServerErrorResponse;

interface Props {
  role: "client" | "provider";
}

export default function GoogleOAuthButton({ role }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const t = useTranslations("auth.login");

  const handleGoogleSuccess = useCallback(
    (credentialResponse: CredentialResponse) => {
      const credential = credentialResponse.credential;
      if (!credential) {
        logger.error("Google returned no credential (id_token).");
        setErrorMessage("Google login failed: no token returned.");
        return;
      }

      (async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
          const response = await loginWithGoogle({ token: credential, role });

          if ("access_token" in response.data) {
            // Success branch
            await secureStorage.set("accessToken", response.data.access_token);
            await secureStorage.set("refreshToken", response.data.refresh_token);

            router.push(response.data.role === "provider" ? "/complete-provider" : "/");
          } else {
            // Error branch (400 / 500)
            logger.error("Auth failed:", response.data.message, response.data.errors);
            setErrorMessage(response.data.message || "Authentication failed");
          }
        } catch (error) {
          const err = error as AxiosError<AuthBadRequestResponse | AuthServerErrorResponse>;
          logger.error("Google auth request failed:", err.message, err.response?.data);
          setErrorMessage(err?.response?.data?.message || "Network or server error");
        } finally {
          setLoading(false);
        }
      })();
    },
    [role, router]
  );

  return (
    <div className="relative w-full">
      {/* Visual custom button */}
      <button
        type="button"
        aria-label="Continue with Google"
        className="font-roboto text-subtext border-secondary z-0 flex h-12 w-full cursor-pointer items-center justify-center  rounded-xl border text-[14px] font-medium transition-colors duration-300 hover:border-none hover:bg-[#f9fafb] focus:bg-[#F3F4F6] disabled:bg-transparent disabled:text-[#9CA3AF]"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <Google className="h-6 w-6" aria-hidden="true" /> {t("continuingWithGoogle")}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Google className="h-6 w-6" aria-hidden="true" /> {t("continueWithGoogle")}
          </div>
        )}
      </button>

      {/* Invisible GoogleLogin overlay */}
      <div className="absolute inset-0 z-10 opacity-0">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrorMessage("Google login failed")}
          useOneTap={false}
          type="standard"
          theme="outline"
          size="large"
          width="100%"
          text="continue_with"
          shape="rectangular"
        />
      </div>

      {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
