"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";
import { Controller } from "react-hook-form";

import BrifCase from "@/assets/providerDashboard/BrifCase.svg";
import CallBlue from "@/assets/providerDashboard/CallBlue.svg";
import Camera from "@/assets/providerDashboard/Camera.svg";
import ProfileImage from "@/assets/providerDashboard/i1.png";
import Plus from "@/assets/providerDashboard/Plus.svg";
import UserProfile from "@/assets/providerDashboard/Profile.svg";
import UploadGray from "@/assets/providerDashboard/UploadGray.svg";
import X from "@/assets/providerDashboard/X.svg";
import { logger } from "@/lib/logger";
import { cityOptions, popularServices } from "@/utils/constants/homeData";
import { type EditProfileFormType } from "@/validation/providerDashboard/editProfileSchema";

import ProviderInput from "../components/providerInput";
import ProviderSelect from "../components/providerSelect";
import ProviderTextarea from "../components/providerTextarea";
import { useEditProfileForm } from "../hooks/useEditProfileForm";
import Inputlabel from "./inputlabel";

interface EditProfileModalProps {
  onClose: () => void;
  defaultValues?: Partial<EditProfileFormType>;
  onSave: (service: EditProfileFormType) => void;
}

export default function EditProfileModal({
  onClose,
  defaultValues,
  onSave,
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
      formState: { errors, dirtyFields },
    },
  } = useEditProfileForm(defaultValues);
  const t = useTranslations("providersDashboard.editProfileModal");
  console.log(t("sections.professionalDetails.uploadImage", { index: 2 + 1 }));
  const onSubmit = (data: EditProfileFormType) => {
    logger.info("Submitted profile:", data);
    alert("Profile Edited successfully!");
    onSave(data);
    reset();
    onClose();
  };

  const percentComplete = 80;

  return (
    <div className="fixed inset-0  z-50 flex items-center justify-center bg-black/20 p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editProfileTitle"
        aria-describedby="editProfileDescription"
        className="scrollbar-hide relative  max-h-[90vh] w-full overflow-y-auto rounded-xl lg:w-[800px]"
      >
        <div className="origin-top scale-[1] overflow-y-auto rounded-xl bg-white shadow-xl md:scale-[1]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-3 pt-6">
            <div>
              <h2 className="text-foreground text-xl font-semibold">{t("title")}</h2>
              <p className="font-roboto text-[14px] font-normal text-[#4B5563]">
                <p>{t("description")}</p>
              </p>
            </div>
            <button onClick={onClose} aria-label="Close edit profile modal">
              <X className="text-muted-foreground h-4 w-4 cursor-pointer" />
            </button>
          </div>

          {/* Progress bar */}

          <div className="w-full space-y-2 border-b border-gray-200 px-6">
            <h4 className="font-poppins text-[14px] font-medium text-[#374151]">
              {t("profileCompletion.label", { percent: percentComplete })}
            </h4>
            <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${percentComplete}%` }}
                aria-valuenow={percentComplete}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t("profileCompletion.ariaLabel", { percent: percentComplete })}
              />
            </div>
          </div>

          <form aria-label="Edit Profile Form" onSubmit={handleSubmit(onSubmit)} className=" ">
            <div className="space-y-6 p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <h3 className="font-poppins mb-4 flex items-center justify-start gap-2 self-start text-[18px] font-semibold text-[#111827]">
                  <UserProfile className="h-4 w-4 " />
                  {t("sections.profileInformation.heading")}
                </h3>
                <div className="relative mb-2 h-24 w-24 rounded-full">
                  <Image
                    src={
                      profileImage
                        ? typeof profileImage === "string"
                          ? profileImage // ✅ existing backend URL
                          : URL.createObjectURL(profileImage) // ✅ new uploaded file
                        : ProfileImage // fallback
                    }
                    alt="Profile"
                    width={96}
                    height={96}
                    className="h-[96px] w-[96px] rounded-full"
                  />
                  <div
                    onClick={handleProfileClick}
                    className="bg-primaryDark absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full"
                  >
                    <Camera className="h-4 w-4 cursor-pointer" />
                  </div>
                </div>
                <input
                  ref={profileImageRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => onProfileChange(e)}
                />
                <button
                  type="button"
                  className="font-roboto text-primaryDark text-[14px] font-medium"
                >
                  {t("sections.profileInformation.changePhoto")}
                </button>
                <p className="font-roboto mt-2 text-[12px] font-normal text-[#6B7280]">
                  {t("sections.profileInformation.avatarTip")}
                </p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ProviderInput
                  label={t("sections.basicInfo.fullName")}
                  placeholder={t("sections.basicInfo.fullNamePlaceholder")}
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
                      label={t("sections.basicInfo.profession")}
                      placeholder={t("sections.basicInfo.professionPlaceholder")}
                      options={popularServices}
                      error={errors.profession}
                      dirty={!!dirtyFields.profession}
                    />
                  )}
                />
              </div>

              <ProviderTextarea
                label={t("sections.basicInfo.bio")}
                placeholder={t("sections.basicInfo.bioPlaceholder")}
                error={errors.bio}
                dirty={!!dirtyFields.bio}
                {...register("bio")}
              />

              {/* Location & Experience */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <ProviderSelect
                      {...field}
                      label={t("sections.locationExperience.city")}
                      placeholder={t("sections.locationExperience.cityPlaceholder")}
                      options={cityOptions}
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

                {/* Languages */}
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

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="font-poppins mb-4 flex items-center justify-start gap-2 text-[18px] font-semibold text-[#111827]">
                  <CallBlue className="h-4 w-4 " />
                  {t("sections.contactMethods.heading")}
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

              {/* service Image */}
              <div>
                <h3 className="font-poppins mb-4 flex items-center justify-start gap-2 text-[18px] font-semibold text-[#111827]">
                  <BrifCase className="h-4 w-4" />
                  {t("sections.professionalDetails.heading")}
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

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 border-t border-gray-200 p-6 pt-5">
              <button
                type="button"
                aria-label="Close Modal"
                onClick={onClose}
                className="border-1 w-full cursor-pointer rounded-lg border-gray-200 py-2 text-[#374151] duration-300 hover:bg-gray-300"
              >
                {t("buttons.cancel")}
              </button>
              <button
                type="submit"
                aria-label="Save Profile Changes"
                className="bg-primary hover:bg-btnHover w-full cursor-pointer rounded-lg py-2 text-white shadow-md duration-300"
              >
                {t("buttons.saveChanges")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
