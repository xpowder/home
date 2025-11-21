"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { secureStorage } from "@/lib/secureStorage";
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
        secureStorage.set("accessToken", res.data.access_token);
        secureStorage.set("refreshToken", res.data.refresh_token);

        router.push(res.data.role === "provider" ? "/complete-provider" : "/");
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
