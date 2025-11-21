"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { ServiceFormType, serviceSchema } from "@/validation/providerDashboard/serviceSchema";

export const useServiceForm = (defaultValues?: Partial<ServiceFormType>) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    (defaultValues?.images as string[]) || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ServiceFormType>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      category: "",
      city: "",
      description: "",
      startingPrice: 0,
      status: true,
      images: [],
      ...defaultValues,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      form.setValue("images", previewUrls as string[]); // store URLs instead of File[]
      setImagePreviews(previewUrls);
    }
  };

  useEffect(() => {
    // Lock background scroll
    document.body.style.overflow = "hidden";

    // Unlock when modal unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return {
    form,
    fileInputRef,
    imagePreviews,
    handleImageChange,
  };
};
