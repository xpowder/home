"use client";
import { Image as Imag } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";
import { Controller } from "react-hook-form";

import Cam from "@/assets/auth/Cam.svg";
import Tick from "@/assets/auth/Tick2.svg";
import AddImage from "@/assets/auth/uploadImage.svg";
import WhiteTick from "@/assets/auth/whitetick.svg";
import useCatagory from "@/hooks/useCatagory";
import useCity from "@/hooks/useCity";
import { sectionHeading } from "@/utils/fonts";

import Inputlabel from "../components/inputlabel";
// import { popularServices, cityOptions } from "@/utils/constants/homeData"
import ProviderInput from "../components/providerInput";
import ProviderSelect from "../components/providerSelect";
import ProviderTextarea from "../components/providerTextarea";
import { useProviderProfileForm } from "../hooks/useProviderProfileForm";

export default function Page() {
  const { categories: popularServices } = useCatagory();
  const { cities: cityOptions } = useCity();
  const {
    profilePhotoRef,
    portfolioRefs,
    profilePhoto,
    portfolioImages,
    handleProfileClick,
    handlePortfolioClick,
    onProfileChange,
    onPortfolioChange,
    onSubmit,
    register,
    control,
    errors,
    dirtyFields,
    formError,
  } = useProviderProfileForm();
  const t = useTranslations("auth.profileSetup");

  return (
    <section className="min-h-screen w-full">
      <div className="dark:bg-secondary flex w-full flex-col items-center justify-center bg-white p-5">
        {/* Progress Section */}

        <div className="flex w-full flex-col items-center justify-center gap-5">
          {/* Step Indicators */}
          <div className="flex items-center gap-5">
            {/* Step 1 */}
            <div className="font-roboto flex flex-col items-center justify-center gap-3 text-[14px] font-medium text-[#16A34A] md:flex-row">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A]">
                <Tick className="h-3 w-3" />
              </div>
              {t("steps.step1")}
            </div>

            {/* Divider */}
            <div className="bg-primaryDark h-0.5 w-20" />

            {/* Step 2 */}
            <div className="font-roboto text-primaryDark flex flex-col items-center justify-center gap-3 text-[14px] font-medium md:flex-row">
              <div className="bg-primaryDark flex h-8 w-8 items-center justify-center rounded-full text-white">
                2
              </div>
              {t("steps.step2")}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-primaryDark h-2.5 w-full max-w-[800px] rounded-full md:min-w-[480px]" />

          {/* Heading */}
          <h2 className={`${sectionHeading} text-heading text-center`}>{t("heading")}</h2>

          {/* Description */}
          <p className="font-roboto text-subtext text-center text-[calc(11px+.5vw)] font-light">
            {t("description")}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-background flex w-full max-w-[800px] flex-col items-center justify-center gap-5 rounded-xl p-5 text-center shadow-md shadow-black/20 md:p-10"
        >
          {/* Service Inputs */}
          <Controller
            control={control}
            name="service_category"
            render={({ field }) => (
              <ProviderSelect
                {...field}
                options={popularServices.map((service) => service.name_en)}
                label={t("form.serviceCategory.label")}
                placeholder={t("form.serviceCategory.placeholder")}
                error={errors.service_category}
                dirty={!!dirtyFields.service_category}
              />
            )}
          />

          <ProviderInput
            {...register("service_title")}
            label={t("form.serviceTitle.label")}
            placeholder={t("form.serviceTitle.placeholder")}
            error={errors.service_title}
            dirty={!!dirtyFields.service_title}
          />
          <div className="flex w-full flex-col items-center justify-start gap-5 lg:flex-row">
            <ProviderInput
              {...register("years_experience", { valueAsNumber: true })}
              label={t("form.yearsExperience.label")}
              placeholder={t("form.yearsExperience.placeholder")}
              error={errors.years_experience}
              dirty={!!dirtyFields.years_experience}
            />
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <ProviderSelect
                  {...field}
                  options={cityOptions.map((c) => c.name_en)}
                  label={t("form.city.label")}
                  placeholder={t("form.city.placeholder")}
                  error={errors.city}
                  dirty={!!dirtyFields.city}
                />
              )}
            />
          </div>

          <ProviderInput
            {...register("full_address")}
            label={t("form.fullAddress.label")}
            placeholder={t("form.fullAddress.placeholder")}
            error={errors.full_address}
            dirty={!!dirtyFields.full_address}
          />
          <ProviderInput
            {...register("starting_price_mad", { valueAsNumber: true })}
            label={t("form.startingPrice.label")}
            placeholder={t("form.startingPrice.placeholder")}
            error={errors.starting_price_mad}
            dirty={!!dirtyFields.starting_price_mad}
          />
          <ProviderTextarea
            {...register("bio")}
            label={t("form.bio.label")}
            placeholder={t("form.bio.placeholder")}
            error={errors.bio}
            dirty={!!dirtyFields.bio}
          />

          {/* Upload Photos */}
          <div className="w-full space-y-5">
            <h2 className="font-roboto flex items-center justify-start gap-2 text-[20px] font-semibold text-[#1F2937]">
              <Cam className="h-6 w-6" /> {t("uploadPhotos")}
            </h2>

            {/* Profile Photo */}
            <div className="w-full space-y-2">
              <Inputlabel label={t("form.profilePhoto.label")} info={t("form.profilePhoto.info")} />
              <div
                onClick={handleProfileClick}
                className="flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-[2px] border-dashed border-gray-300 transition hover:border-gray-400"
              >
                {profilePhoto ? (
                  <Image
                    src={URL.createObjectURL(profilePhoto)}
                    alt="Profile Preview"
                    height={160}
                    width={160}
                    className="h-40 w-40"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AddImage className="h-8 w-8" />
                    <h3 className="font-roboto text-[16px] font-medium text-[#4B5563]">
                      {t("form.profilePhoto.clickToUpload")}
                    </h3>
                    <h3 className="font-roboto text-[16px] font-normal text-[#9CA3AF]">
                      {t("form.profilePhoto.info")}
                    </h3>
                  </div>
                )}
              </div>
              <input
                ref={profilePhotoRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => onProfileChange(e)}
              />
              {errors.profile_photo?.message ? (
                <p className="text-left text-xs text-red-500">{errors.profile_photo.message}</p>
              ) : null}
            </div>

            {/* Portfolio Images */}
            <div className="w-full space-y-2">
              <Inputlabel label={t("form.portfolioImages.label")} info="" />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {portfolioRefs.map((ref, i) => (
                  <div
                    key={i}
                    onClick={() => handlePortfolioClick(i)}
                    className="h-30 flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-[2px] border-dashed border-gray-300 transition hover:border-gray-400"
                  >
                    {portfolioImages?.[i] ? (
                      <Image
                        src={URL.createObjectURL(portfolioImages[i])}
                        alt={`Portfolio ${i + 1}`}
                        height={120}
                        width={120}
                        className="h-30 w-30"
                      />
                    ) : (
                      <>
                        <Imag className="h-6 w-8" />
                        <h3 className="font-roboto text-[14px] font-normal text-[#9CA3AF]">
                          {t("form.portfolioImages.uploadImage")} {i + 1}
                        </h3>
                      </>
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
                {errors.portfolio_images?.message ? (
                  <p className="text-left text-xs text-red-500">
                    {errors.portfolio_images.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="font-roboto bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled mt-5 flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-[18px] font-bold text-white duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
          >
            <WhiteTick className="h-4 w-4" /> {t("form.submitButton")}
          </button>
          {formError && <p className="text-left text-sm text-red-500">{formError}</p>}
          <p className="font-roboto text-subtext text-[16px] font-normal ">{t("form.infoText")}</p>
        </form>
      </div>
    </section>
  );
}
