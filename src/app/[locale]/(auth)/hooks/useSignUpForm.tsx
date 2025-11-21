"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { logger } from "@/lib/logger";
import { registerUser } from "@/services/auth.services";
import { type SignUpSchema, signUpSchema } from "@/validation/auth/signUpSchema";

interface BackendErrorResponse {
  status: string;
  message: string;
  errors?: { field: string; message: string }[];
}

export interface SignUpSuccessResponse {
  message: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    last_login: string;
  };
  errors?: Record<string, unknown>[];
}

export const useSignUpForm = (role: "client" | "provider") => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, dirtyFields },
    setError,
    reset,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await registerUser({ ...data, role }); // ✅ call service
      reset();
      router.push(`/email-verification?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      const error = err as AxiosError<BackendErrorResponse>;
      const data = error.response?.data;
      // Handle structured backend errors
      // Handle structured backend errors by directly mapping 'field' and 'message'
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((e) => {
          // FIX: Directly use e.field and e.message instead of iterating over Object.entries
          const fieldName = e.field as keyof SignUpSchema;
          const errorMessage = e.message;

          if (fieldName && errorMessage) {
            setError(fieldName, {
              type: "manual",
              message: errorMessage,
            });
          }
        });
        logger.error("Validation errors:", data.errors);
      } else {
        // fallback generic message
        setFormError(data?.message || "Registration failed. Please try again.");
      }
    }
  });

  return { register, errors, isValid, isSubmitting, onSubmit, dirtyFields, reset, formError };
};
