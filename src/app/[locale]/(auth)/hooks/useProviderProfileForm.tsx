import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { logger } from "@/lib/logger";
import { completeProviderProfile } from "@/services/auth.services";
import {
  type ProviderProfileForm,
  providerProfileSchema,
} from "@/validation/auth/providerProfileSchema";

interface BackendErrorResponse {
  status: string;
  message: string;
  errors?: { field: string; message: string }[];
}

export const useProviderProfileForm = () => {
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const portfolioRefs = useMemo(
    () => Array.from({ length: 3 }, () => React.createRef<HTMLInputElement>()),
    []
  );
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<ProviderProfileForm>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      profile_photo: null,
      portfolio_images: [],
    },
  });

  const onSubmit = handleSubmit(async (data: ProviderProfileForm) => {
    logger.info("submitting Provider Details form complete provider");
    logger.info("Provider Form Data", data);
    //backend operations
    try {
      await completeProviderProfile(data); // ✅ use service
      toast.success("Profile submitted successfully!");
      router.push("/providers-dashboard");
    } catch (err) {
      const error = err as AxiosError<BackendErrorResponse>;
      const data = error.response?.data;
      // Handle structured backend errors
      // Handle structured backend errors by directly mapping 'field' and 'message'
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((e) => {
          // FIX: Directly use e.field and e.message instead of iterating over Object.entries
          const fieldName = e.field as keyof ProviderProfileForm;
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
        setFormError(data?.message || "Complete Profile failed. Please try again.");
      }
    }

    reset();
  });

  const profilePhoto = watch("profile_photo");
  const portfolioImages = watch("portfolio_images") || [];

  const handleProfileClick = () => profilePhotoRef.current?.click();
  const handlePortfolioClick = (index: number) => portfolioRefs[index].current?.click();

  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("profile_photo", file, { shouldValidate: true });
  };

  const onPortfolioChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files?.[0]) {
      const newPortfolio = [...portfolioImages];
      newPortfolio[index] = e.target.files[0];
      setValue("portfolio_images", newPortfolio, { shouldValidate: true });
    }
  };

  return {
    profilePhotoRef,
    portfolioRefs,
    profilePhoto,
    portfolioImages,
    handleProfileClick,
    handlePortfolioClick,
    onProfileChange,
    onPortfolioChange,
    register,
    onSubmit,
    control,
    reset,
    setError,
    watch,
    setValue,
    errors,
    dirtyFields,
    formError,
  };
};
