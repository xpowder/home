"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

import BrifCase from "@/assets/providerDashboard/BrifCase.svg";
import CallBlue from "@/assets/providerDashboard/CallBlue.svg";
import Camera from "@/assets/providerDashboard/Camera.svg";
import ProfileImage from "@/assets/providerDashboard/i1.png";
import Plus from "@/assets/providerDashboard/Plus.svg";
import UserProfile from "@/assets/providerDashboard/Profile.svg";
import UploadGray from "@/assets/providerDashboard/UploadGray.svg";
import X from "@/assets/providerDashboard/X.svg";
import { logger } from "@/lib/logger";
import { cityOptions } from "@/utils/constants/homeData";
import { type EditProfileFormType } from "@/validation/providerDashboard/editProfileSchema";
import useCatagory from "@/hooks/useCatagory";
import useCity from "@/hooks/useCity";
import { updateProviderProfile, uploadProfilePhoto, uploadServicePhoto } from "@/services/provider.services";

import ProviderInput from "../components/providerInput";
import ProviderSelect from "../components/providerSelect";
import ProviderTextarea from "../components/providerTextarea";
import { useEditProfileForm } from "../hooks/useEditProfileForm";
import Inputlabel from "./inputlabel";

interface EditProfileModalProps {
  onClose: () => void;
  defaultValues?: Partial<EditProfileFormType>;
  onSave: (service: EditProfileFormType) => void;
  onProfileUpdate?: () => void;
}

export default function EditProfileModal({
  onClose,
  defaultValues,
  onSave,
  onProfileUpdate,
}: EditProfileModalProps) {
  useEditProfileForm();

  const {
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
    form: {
      register,
      handleSubmit,
      control,
      reset,
      setValue,
      formState: { errors, dirtyFields },
    },
  } = useEditProfileForm(defaultValues);
  const t = useTranslations("providersDashboard.editProfileModal");
  const [submitting, setSubmitting] = useState(false);
  const { categories } = useCatagory();
  const { cities } = useCity();
  const params = useParams();
  const locale = params.locale as string;

  // Create category options with ID as value and localized name as label
  const categoryOptions = categories?.map((cat) => ({
    value: cat.id,
    label: cat[`name_${locale}` as keyof typeof cat] as string || cat.name_en || "",
  })) || [];
  
  // Create city options with ID as value and localized name as label
  const cityOptionsList = cities?.map((city) => ({
    value: city.id,
    label: city[`name_${locale}` as keyof typeof city] as string || city.name_en || "",
  })) || [];

  const onSubmit = async (data: EditProfileFormType) => {
    try {
      setSubmitting(true);
      
      // Map form data to backend format
      // profession and city should be IDs (UUIDs) from the select component
      let categoryId: string | undefined;
      let cityId: string | undefined;
      
      // Validate and extract category ID
      // The form should store IDs, but we'll validate and handle both cases
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (data.profession) {
        // If it's already a valid UUID, use it directly
        if (isValidUUID.test(data.profession)) {
          // Verify the category ID exists in our categories list
          const categoryExists = categories?.some(cat => cat.id === data.profession);
          if (categoryExists) {
            categoryId = data.profession;
          } else {
            throw new Error("Selected category does not exist. Please select a valid category.");
          }
        } else {
          // Otherwise, try to find by name (for backward compatibility when loading from API)
          const category = categories?.find(
            (cat) => cat[`name_${locale}` as keyof typeof cat] === data.profession || 
                     cat.name_en === data.profession ||
                     cat.name_fr === data.profession ||
                     cat.name_ar === data.profession
          );
          if (category) {
            categoryId = category.id;
          } else {
            logger.error("Category not found:", data.profession);
            throw new Error("Invalid category selected. Please select a category from the list.");
          }
        }
      }
      
      if (data.city) {
        // If it's already a valid UUID, use it directly
        if (isValidUUID.test(data.city)) {
          // Verify the city ID exists in our cities list
          const cityExists = cities?.some(cityItem => cityItem.id === data.city);
          if (cityExists) {
            cityId = data.city;
          } else {
            throw new Error("Selected city does not exist. Please select a valid city.");
          }
        } else {
          // Otherwise, try to find by name (for backward compatibility when loading from API)
          const city = cities?.find(
            (cityItem) => cityItem[`name_${locale}` as keyof typeof cityItem] === data.city || 
                         cityItem.name_en === data.city ||
                         cityItem.name_fr === data.city ||
                         cityItem.name_ar === data.city
          );
          if (city) {
            cityId = city.id;
          } else {
            logger.error("City not found:", data.city);
            throw new Error("Invalid city selected. Please select a city from the list.");
          }
        }
      }
      
      // Validate required fields
      if (!categoryId || !isValidUUID.test(categoryId)) {
        throw new Error("Category is required. Please select a valid category from the list.");
      }
      if (!cityId || !isValidUUID.test(cityId)) {
        throw new Error("City is required. Please select a valid city from the list.");
      }
      
      // Final validation - ensure IDs exist in our lists before sending
      if (categoryId && categories) {
        const validCategory = categories.find(cat => cat.id === categoryId);
        if (!validCategory) {
          logger.error("Invalid category ID:", categoryId, "Available categories:", categories.map(c => c.id));
          throw new Error(`Invalid category ID. Please refresh the page and try again.`);
        }
      }
      
      if (cityId && cities) {
        const validCity = cities.find(cityItem => cityItem.id === cityId);
        if (!validCity) {
          logger.error("Invalid city ID:", cityId, "Available cities:", cities.map(c => c.id));
          throw new Error(`Invalid city ID. Please refresh the page and try again.`);
        }
      }
      
      logger.info("Submitting profile update with category ID:", categoryId, "and city ID:", cityId);

      // Extract years from experience string (e.g., "5 years" -> 5)
      const yearsExperience = data.experience 
        ? (() => {
      const yearsMatch = data.experience.match(/(\d+)/);
            return yearsMatch ? parseInt(yearsMatch[1]) : undefined;
          })()
        : undefined;

      // Build update data according to backend schema
      // Only include fields that have values (required fields: category and city)
      const updateData: {
        service_category?: string;
        city?: string;
        service_title?: string;
        bio?: string;
        years_experience?: number;
        starting_price_mad?: number;
        full_address?: string;
      } = {};
      
      // REQUIRED fields
      if (categoryId) updateData.service_category = categoryId;
      if (cityId) updateData.city = cityId;
      
      // Optional fields - only include if they have values
      if (data.fullName && data.fullName.trim()) {
        updateData.service_title = data.fullName.trim();
      }
      if (data.bio && data.bio.trim()) {
        updateData.bio = data.bio.trim();
      }
      if (yearsExperience !== undefined && yearsExperience !== null && yearsExperience > 0) {
        updateData.years_experience = yearsExperience;
      }
      if (data.startingPrice !== undefined && data.startingPrice !== null && data.startingPrice >= 0) {
        updateData.starting_price_mad = data.startingPrice;
      }
      if (data.serviceArea && data.serviceArea.trim()) {
        updateData.full_address = data.serviceArea.trim();
      }

      // Call API to update provider profile
      // Endpoint: /api/profile/update-provider
      const response = await updateProviderProfile(updateData);
      
      logger.info("Profile updated successfully:", response);
      
      // Log the active provider status from response
      if (response.user?.is_active_provider !== undefined) {
        logger.info(`Provider active status: ${response.user.is_active_provider}`);
      }

      // Profile photo is already uploaded when user selects it (via handleProfileImageChange)
      // So we just need to get the URL from the form data
      let profilePhotoUrl: string | null = null;
      if (data.profileImage) {
        profilePhotoUrl = typeof data.profileImage === "string" 
          ? data.profileImage 
          : null; // If it's still a File, it means upload failed, but we'll handle it
      }

      // Upload service photo if changed
      if (data.serviceImage && data.serviceImage instanceof File) {
        try {
        await uploadServicePhoto(data.serviceImage);
          logger.info("Service photo uploaded successfully");
        } catch (photoError) {
          logger.error("Error uploading service photo:", photoError);
          // Don't fail the whole update if photo upload fails
        }
      }

      // Update data with profile photo URL
      const updatedData = profilePhotoUrl 
        ? { ...data, profileImage: profilePhotoUrl }
        : data;

      toast.success("Profile updated successfully!");
      onSave(updatedData);
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      reset();
      onClose();
    } catch (error: any) {
      logger.error("Error updating profile:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to update profile. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Custom handler to upload profile photo immediately when selected
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      try {
        setSubmitting(true);
        const response = await uploadProfilePhoto(file);
        if (response.photo_url) {
          // Update form with the uploaded photo URL
          setValue("profileImage", response.photo_url, { shouldValidate: true });
          toast.success("Profile photo uploaded successfully!");
          // Refresh parent profile component
          if (onProfileUpdate) {
            onProfileUpdate();
          }
        }
      } catch (error) {
        logger.error("Error uploading profile photo:", error);
        toast.error("Failed to upload profile photo.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const percentComplete = 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editProfileTitle"
        aria-describedby="editProfileDescription"
        className="scrollbar-hide relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white dark:bg-gray-900 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4">
          <div>
            <h2 id="editProfileTitle" className="text-gray-900 dark:text-white text-xl font-semibold">
              {t("title") || "Edit Profile"}
            </h2>
            <p id="editProfileDescription" className="font-roboto text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
              {t("description") || "Keep your information up to date so clients can find and trust you."}
            </p>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close edit profile modal"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5 cursor-pointer" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h4 className="font-poppins text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile {percentComplete}% complete
            </h4>
            <span className="font-poppins text-sm font-medium text-primary">
              Almost there!
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
              aria-valuenow={percentComplete}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Profile ${percentComplete}% complete`}
            />
          </div>
        </div>

        <form aria-label="Edit Profile Form" onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
          <div className="space-y-8 p-6">
            {/* Profile Information Section */}
            <div className="space-y-4">
              <h3 className="font-poppins flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <UserProfile className="h-5 w-5 text-primary" />
                {t("sections.profileInformation.heading") || "Profile Information"}
              </h3>
              
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3 h-24 w-24 rounded-full">
                  <Image
                    src={
                      profileImage
                        ? typeof profileImage === "string"
                          ? profileImage
                          : URL.createObjectURL(profileImage)
                        : ProfileImage
                    }
                    alt="Profile"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleProfileClick}
                    className="bg-primary absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full shadow-md hover:bg-primaryDark transition-colors"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                  <input
                    ref={profileImageRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="font-roboto text-primary text-sm font-medium hover:underline"
                >
                  {t("sections.profileInformation.changePhoto") || "Change Photo"}
                </button>
                <p className="font-roboto mt-1 text-xs font-normal text-gray-500 dark:text-gray-400 text-center">
                  {t("sections.profileInformation.avatarTip") || "Add a photo - profiles with pictures get 3x more views."}
                </p>
                {errors.profileImage && (
                  <p className="text-red-500 text-xs mt-1 text-center">{errors.profileImage.message}</p>
                )}
              </div>

              {/* Basic Info Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ProviderInput
                  label={t("sections.basicInfo.fullName") || "Full Name / Business Name"}
                  placeholder={t("sections.basicInfo.fullNamePlaceholder") || "e.g. Youssef Plumbing Services"}
                  error={errors.fullName}
                  dirty={!!dirtyFields.fullName}
                  {...register("fullName")}
                />

                <Controller
                  control={control}
                  name="profession"
                  render={({ field }) => (
                    <ProviderSelect
                      {...field}
                      label={`${t("sections.basicInfo.profession") || "Profession / Category"} *`}
                      placeholder={t("sections.basicInfo.professionPlaceholder") || "Select your profession"}
                      options={categoryOptions}
                      error={errors.profession}
                      dirty={!!dirtyFields.profession}
                    />
                  )}
                />
              </div>

              <ProviderTextarea
                label={t("sections.basicInfo.bio") || "Bio / About Me"}
                placeholder={t("sections.basicInfo.bioPlaceholder") || "Describe your experience and what makes you unique."}
                error={errors.bio}
                dirty={!!dirtyFields.bio}
                {...register("bio")}
              />
              {dirtyFields.bio && !errors.bio && (
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                  Your bio helps clients understand your style and expertise.
                </p>
              )}

              {/* Location & Experience */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <ProviderSelect
                      {...field}
                      label={`${t("sections.locationExperience.city")} *`}
                      placeholder={t("sections.locationExperience.cityPlaceholder")}
                      options={cityOptionsList.length > 0 ? cityOptionsList : cityOptions}
                      error={errors.city}
                      dirty={dirtyFields.city}
                    />
                  )}
                />

                {/* Service area */}
                <ProviderInput
                  label={t("sections.locationExperience.serviceArea")}
                  placeholder={t("sections.locationExperience.serviceAreaPlaceholder")}
                  error={errors.serviceArea}
                  dirty={dirtyFields.serviceArea}
                  {...register("serviceArea")}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ProviderInput
                  label={t("sections.locationExperience.experience")}
                  placeholder={t("sections.locationExperience.experiencePlaceholder")}
                  error={errors.experience}
                  dirty={dirtyFields.experience}
                  {...register("experience")}
                />

                <ProviderInput
                  label="Pricing"
                  placeholder={t("sections.locationExperience.startingPricePlaceholder") || "Enter your starting price"}
                  type="number"
                  min="0"
                  step="1"
                  error={errors.startingPrice}
                  dirty={!!dirtyFields.startingPrice}
                  {...register("startingPrice", { valueAsNumber: true })}
                />
              </div>

              {/* Languages */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div aria-label="Languages Spoken Section">
                  <Inputlabel label={t("sections.languages.label")} />
                  <div
                    role="group"
                    aria-label="Language selection buttons"
                    className="mb-2 mt-1 flex flex-wrap gap-2"
                  >
                    {languages.map((lang) => (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`font-roboto cursor-pointer rounded-full px-3 py-1 text-[12px] font-normal transition-all ${
                          selectedLanguages?.includes(lang)
                            ? "bg-primary text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}

                    {/* Add button — always last */}
                    {!showInput && (
                      <button
                        type="button"
                        onClick={() => setShowInput(true)}
                        className="font-roboto flex cursor-pointer items-center justify-center gap-1 rounded-full border-[2px] border-dashed border-[#9CA3AF] px-3 py-1 text-[12px] font-normal text-[#4B5563]"
                      >
                        <Plus className="h-2 w-2 text-[#4B5563]" />
                        {t("sections.languages.addButton")}
                      </button>
                    )}
                    {/* Input + Dropdown */}
                    {showInput && (
                      <div
                        ref={languageInputRef}
                        className="relative w-48"
                        role="combobox"
                        aria-expanded={filteredLanguages.length > 0}
                        aria-haspopup="listbox"
                        aria-controls="language-list"
                        aria-label="Add or search for a language"
                      >
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={t("sections.languages.inputPlaceholder")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && searchTerm.trim()) {
                              const newLang = searchTerm.trim();
                              if (!languages.includes(newLang)) {
                                setLanguages([...languages, newLang]);
                              }
                              setSearchTerm("");
                              setShowInput(false);
                            }
                          }}
                          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none"
                          autoFocus
                        />

                        {/* Dropdown suggestions */}
                        {filteredLanguages.length > 0 && (
                          <ul
                            role="listbox"
                            aria-label="Language suggestions"
                            className="absolute inset-x-0 z-10 mt-1 max-h-36 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md"
                          >
                            {filteredLanguages.map((lang) => (
                              <li
                                key={lang}
                                onClick={() => {
                                  if (!languages.includes(lang)) {
                                    setLanguages([...languages, lang]);
                                  }
                                  setSearchTerm("");
                                  setShowInput(false);
                                }}
                                className="cursor-pointer px-3 py-1.5 text-sm hover:bg-gray-100"
                              >
                                {lang}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  {errors.languages && (
                    <p className="mt-1 text-sm text-red-500">{errors.languages.message}</p>
                  )}
                </div>
              </div>

            {/* Contact Methods Section */}
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-poppins flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <CallBlue className="h-5 w-5 text-primary" />
                {t("sections.contactMethods.heading") || "Contact Methods"}
              </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ProviderInput
                    label={t("sections.contactMethods.phone")}
                    placeholder={t("sections.contactMethods.phonePlaceholder")}
                    error={errors.phone}
                    dirty={dirtyFields.phone}
                    {...register("phone")}
                  />
                  <ProviderInput
                    label={t("sections.contactMethods.whatsapp")}
                    placeholder={t("sections.contactMethods.whatsappPlaceholder")}
                    error={errors.whatsapp}
                    dirty={dirtyFields.whatsapp}
                    {...register("whatsapp")}
                  />
                </div>
                <ProviderInput
                  label={t("sections.contactMethods.email")}
                  placeholder={t("sections.contactMethods.emailPlaceholder")}
                  error={errors.email}
                  dirty={dirtyFields.email}
                  {...register("email")}
                />
              </div>

            {/* Professional Details Section */}
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-poppins flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <BrifCase className="h-5 w-5 text-primary" />
                {t("sections.professionalDetails.heading") || "Professional Details"}
              </h3>
                <div className="w-full space-y-2">
                  <Inputlabel label={t("sections.professionalDetails.uploadPortfolio")} />
                  <div
                    onClick={handleServiceImageClick}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        const file = e.dataTransfer.files[0];
                        // Call your handler with a fake event-like structure
                        onServiceImageChange({
                          target: { files: [file] },
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }
                    }}
                    className="h-35 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-[2px] border-dotted border-gray-300 transition hover:border-gray-400"
                  >
                    {serviceImage ? (
                      <Image
                        src={
                          typeof serviceImage === "string"
                            ? serviceImage
                            : URL.createObjectURL(serviceImage)
                        }
                        alt="Service Image Preview"
                        height={160}
                        width={160}
                        className="h-40 w-40"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-center md:text-start">
                        <UploadGray className="h-8 w-8" />
                        <h3 className="font-roboto text-[16px] font-medium text-[#4B5563]">
                          {t("sections.professionalDetails.dragDropTip")}
                        </h3>
                        <h3 className="font-roboto text-[16px] font-normal text-[#9CA3AF]">
                          {t("sections.professionalDetails.formatsTip")}
                        </h3>
                      </div>
                    )}
                  </div>
                  <input
                    ref={serviceImageRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={(e) => onServiceImageChange(e)}
                  />
                  {errors.serviceImage?.message ? (
                    <p className="text-left text-xs text-red-500">{errors.serviceImage.message}</p>
                  ) : dirtyFields.serviceImage ? (
                    <p className="text-left text-xs text-green-600">Image format is correct</p>
                  ) : null}
                </div>

                {/* Portfolio Images */}
                <div className="w-full space-y-2">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {portfolioRefs.map((ref, i) => (
                      <div
                        key={i}
                        onClick={() => handlePortfolioClick(i)}
                        className="h-30 flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-[2px] border-dotted border-gray-300 transition hover:border-gray-400"
                      >
                        {portfolioImages?.[i] ? (
                          <Image
                            src={
                              typeof portfolioImages?.[i] === "string"
                                ? portfolioImages?.[i]
                                : URL.createObjectURL(portfolioImages[i])
                            }
                            alt={`Portfolio ${i + 1}`}
                            height={120}
                            width={120}
                            className="h-30 w-30"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#F9FAFB]">
                            <Plus className="h-6 w-8 text-gray-300" />
                            <h3 className="font-roboto text-[14px] font-normal text-[#9CA3AF]">
                              {t("sections.professionalDetails.uploadImage", { index: i + 1 })}
                            </h3>
                          </div>
                        )}
                        <input
                          ref={ref}
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={(e) => onPortfolioChange(e, i)}
                        />
                      </div>
                    ))}
                    {errors.portfolioImages?.message ? (
                      <p className="text-left text-xs text-red-500">
                        {errors.portfolioImages.message}
                      </p>
                    ) : dirtyFields.portfolioImages ? (
                      <p className="text-left text-xs text-green-600">Image format is correct</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="sticky bottom-0 flex items-center justify-end gap-4 border-t border-gray-200 bg-white px-6 py-4">
            <button
              type="button"
              aria-label="Close Modal"
              onClick={onClose}
              className="font-roboto w-full cursor-pointer rounded-lg border border-[#D1D5DB] bg-white px-6 py-2.5 text-sm font-medium text-[#374151] transition duration-300 hover:bg-gray-50 sm:w-auto"
            >
              {t("buttons.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              aria-label="Save Profile Changes"
              className="bg-primary hover:bg-primaryDark font-roboto w-full cursor-pointer rounded-lg px-6 py-2.5 text-sm font-medium text-white shadow-sm transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
              disabled={submitting}
            >
              {submitting ? (t("buttons.saving") || "Saving...") : (t("buttons.saveChanges") || "Save Changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
