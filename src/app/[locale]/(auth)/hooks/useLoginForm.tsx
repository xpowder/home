"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, HttpStatusCode } from "axios";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { secureStorage } from "@/lib/secureStorage";
import { getMyProfile } from "@/services/profile.services";
import { getProfileCompletionStatus } from "@/services/profile.services";
import { loginUser } from "@/services/auth.services";
import { type LoginSchema, loginSchema } from "@/validation/auth/loginSchema";

interface BackendFieldError {
  field: keyof LoginSchema | "non_field";
  message: string;
}

interface BackendErrorResponse {
  message?: string;
  errors?: BackendFieldError[];
}

export interface LoginSuccessResponse {
  status: "success";
  access_token: string;
  refresh_token: string;
  role: "client" | "provider";
  user_id: string;
}

export const useLoginForm = () => {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, dirtyFields },
    setError,
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    const identifier = data.email;
    try {
      // no need to send role — backend doesn't use it
      const res = await loginUser(data);
      if (res.data.status === "success") {
        await secureStorage.set("accessToken", res.data.access_token);
        await secureStorage.set("refreshToken", res.data.refresh_token);

        // Dispatch event to notify AuthContext to refresh profile
        window.dispatchEvent(new Event("auth:tokenSet"));

        // Small delay to allow AuthContext to fetch profile
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check for return URL in query params
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get("returnUrl");
        
        // If there's a return URL, go there; otherwise determine redirect based on role
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
        } else if (res.data.role === "provider") {
          // For providers, check if they have completed profile or have services
          try {
            // Fetch profile to check completion status
            const profileResponse = await getMyProfile();
            const profile = profileResponse.user;
            
            // Check if provider has completed profile (has service_category and service_title)
            const hasService = !!(profile.service_category && profile.service_title);
            
            // Check profile completion percentage
            let isProfileComplete = false;
            try {
              const completionResponse = await getProfileCompletionStatus();
              const completionPercentage = completionResponse.profile_completion?.completion_percentage || 0;
              // Consider profile complete if at least 80% complete
              isProfileComplete = completionPercentage >= 80;
            } catch (error) {
              // If we can't fetch completion status, fall back to checking key fields
              isProfileComplete = hasService && !!(profile.city && profile.bio);
            }
            
            // Redirect to dashboard if profile is complete OR has a service, otherwise to complete-provider
            if (isProfileComplete || hasService) {
              router.push(`/${locale}/providers-dashboard`);
            } else {
              router.push(`/${locale}/complete-provider`);
            }
          } catch (error) {
            // If profile fetch fails, redirect to complete-provider to be safe
            console.error("Error checking provider profile:", error);
            router.push(`/${locale}/complete-provider`);
          }
        } else {
          // For clients, go to homepage
          router.push(`/${locale}`);
        }
      }
    } catch (err) {
      const error = err as AxiosError<BackendErrorResponse>;
      const status = error.response?.status;
      const data = error.response?.data;

      // Handle unverified email redirect
      if (status === HttpStatusCode.Forbidden) {
        router.push(`/email-verification?email=${encodeURIComponent(identifier)}`);
        return;
      }

      // Handle structured backend errors
      const backendErrors = data?.errors ?? [];
      if (backendErrors.length > 0) {
        backendErrors.forEach((e) => {
          setError(e.field as keyof LoginSchema, {
            type: "manual",
            message: e.message,
          });
        });
      } else {
        setFormError(data?.message || "Registration failed. Please try again.");
      }
    }
  });

  return { register, errors, isValid, isSubmitting, dirtyFields, onSubmit, reset, formError };
};
