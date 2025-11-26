"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  EditProfileFormType,
  editProfileSchema,
} from "@/validation/providerDashboard/editProfileSchema";

export const useEditProfileForm = (defaultValues?: Partial<EditProfileFormType>) => {
  const profileImageRef = useRef<HTMLInputElement>(null);
  const serviceImageRef = useRef<HTMLInputElement>(null);
  const portfolioRefs = useMemo(
    () => Array.from({ length: 3 }, () => React.createRef<HTMLInputElement>()),
    []
  );

  const form = useForm<EditProfileFormType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      profileImage: null,
      fullName: "",
      profession: "",
      bio: "",
      city: "",
      serviceArea: "",
      experience: "",
      startingPrice: undefined,
      languages: [],
      phone: "",
      whatsapp: "",
      email: "",
      serviceImage: null,
      portfolioImages: [],
      ...defaultValues,
    },
    mode: "onChange",
  });

  const { watch, setValue } = form;
  const profileImage = watch("profileImage");
  const serviceImage = watch("serviceImage");
  const portfolioImages = watch("portfolioImages");

  const handleProfileClick = () => profileImageRef.current?.click();
  const handleServiceImageClick = () => serviceImageRef.current?.click();
  const handlePortfolioClick = (index: number) => portfolioRefs[index].current?.click();

  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("profileImage", file, { shouldValidate: true });
  };

  const onServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("serviceImage", file, { shouldValidate: true });
  };

  const onPortfolioChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files?.[0]) {
      const newPortfolio = [...(portfolioImages || [])];
      newPortfolio[index] = e.target.files[0];
      setValue("portfolioImages", newPortfolio, { shouldValidate: true });
    }
  };

  //language
  const [languages, setLanguages] = useState<string[]>(["English", "Frence", "Arabic"]);
  const selectedLanguages = watch("languages");

  const [showInput, setShowInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const languageInputRef = useRef<HTMLDivElement>(null);

  const allLanguages = [
    "English",
    "French",
    "Arabic",
    "Bengali",
    "Hindi",
    "Spanish",
    "Chinese",
    "German",
    "Italian",
    "Japanese",
    "Korean",
    "Urdu",
    "Turkish",
    "Portuguese",
    "Russian",
    "Malay",
  ];

  const filteredLanguages = allLanguages.filter(
    (lang) => lang.toLowerCase().includes(searchTerm.toLowerCase()) && !languages.includes(lang)
  );

  const toggleLanguage = (lang: string) => {
    const current = selectedLanguages || [];
    if (current.includes(lang)) {
      setValue(
        "languages",
        current.filter((l) => l !== lang)
      );
      setLanguages(
        (prev) =>
          prev.includes(lang)
            ? prev.filter((l) => l !== lang) // remove if already selected
            : [...prev, lang] // add if not selected
      );
    } else {
      setValue("languages", [...current, lang]);
    }
  };

  useEffect(() => {
    if (!showInput) return; // Only listen when input is shown

    const handleClickOutside = (event: MouseEvent) => {
      if (languageInputRef.current && !languageInputRef.current.contains(event.target as Node)) {
        setShowInput(false);
        setSearchTerm(""); // optional
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInput]);

  useEffect(() => {
    // Lock background scroll
    document.body.style.overflow = "hidden";

    // Unlock when modal unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return {
    profileImage,
    profileImageRef,
    serviceImageRef,
    portfolioRefs,
    serviceImage,
    portfolioImages,
    handleServiceImageClick,
    handlePortfolioClick,
    handleProfileClick,
    onProfileChange,
    onServiceImageChange,
    onPortfolioChange,
    form,
    // Language-related exports
    languages,
    setLanguages,
    selectedLanguages,
    showInput,
    setShowInput,
    searchTerm,
    setSearchTerm,
    languageInputRef,
    filteredLanguages,
    toggleLanguage,
  };
};
