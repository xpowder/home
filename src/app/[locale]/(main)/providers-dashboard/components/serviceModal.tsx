"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";
import { Controller } from "react-hook-form";

import CheckCircle2 from "@/assets/auth/CheckCircle2.svg";
import XCircle from "@/assets/auth/XCircle.svg";
import Upload from "@/assets/providerDashboard/Upload.svg";
import X from "@/assets/providerDashboard/X.svg";
import { logger } from "@/lib/logger";
import { cityOptions, popularServices } from "@/utils/constants/homeData";
import { ServiceFormType } from "@/validation/providerDashboard/serviceSchema";

import { useServiceForm } from "../hooks/useServiceForm";
import ProviderInput from "./providerInput";
import ProviderSelect from "./providerSelect";
import ProviderTextarea from "./providerTextarea";

interface ServiceModalProps {
  onClose: () => void;
  defaultValues?: Partial<ServiceFormType>;
  onSave: (service: ServiceFormType) => void;
}

export default function ServiceModal({ onClose, defaultValues, onSave }: ServiceModalProps) {
  const {
    form: {
      register,
      handleSubmit,
      control,
      watch,
      formState: { errors, dirtyFields },
      reset,
    },
    fileInputRef,
    imagePreviews,
    handleImageChange,
  } = useServiceForm(defaultValues);

  const onSubmit = (data: ServiceFormType) => {
    logger.info("Form submitted:", data);
    alert("Service saved successfully!");
    onSave(data);
    reset();
    onClose();
  };
  const t = useTranslations("providersDashboard.serviceModal");

  const status = watch("status");

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center bg-black/20 p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        aria-describedby="service-modal-desc"
        className="scrollbar-hide relative  max-h-[90vh] w-full overflow-y-auto rounded-xl lg:w-[800px]"
      >
        <div className="origin-top scale-[1] overflow-y-auto rounded-xl bg-white shadow-xl md:scale-[1]">
          <div className="flex items-center justify-between border-b border-gray-200 p-6 pb-4">
            <h2 className="font-poppins text-[24px] font-semibold text-[#111827]">
              {defaultValues ? t("titleEdit") : t("titleAdd")}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close service modal"
              className="focus:outline-none"
            >
              <X className="h-4 w-4 cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6  ">
            <div className="space-y-6 px-6 pt-6">
              <ProviderInput
                {...register("title")}
                label={t("fields.title")}
                placeholder={t("fields.titlePlaceholder")}
                error={errors.title}
                dirty={!!dirtyFields.title}
              />

              <div className="flex flex-col items-center gap-4 md:flex-row">
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <ProviderSelect
                      {...field}
                      label={t("fields.category")}
                      placeholder={t("fields.categoryPlaceholder")}
                      options={popularServices}
                      error={errors.category}
                      dirty={!!dirtyFields.category}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <ProviderSelect
                      {...field}
                      label={t("fields.city")}
                      placeholder={t("fields.cityPlaceholder")}
                      options={cityOptions}
                      error={errors.city}
                      dirty={!!dirtyFields.city}
                    />
                  )}
                />
              </div>

              <ProviderTextarea
                {...register("description")}
                label={t("fields.description")}
                placeholder={t("fields.descriptionPlaceholder")}
                error={errors.description}
                dirty={!!dirtyFields.description}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 px-6 md:grid-cols-2">
              <div className="relative w-full space-y-1">
                <label
                  htmlFor="startingPrice-input"
                  className="font-poppins text-subtext flex items-center justify-start gap-2 text-[16px] font-medium"
                >
                  {t("fields.startingPrice")}
                </label>

                <div className="relative flex items-center justify-center">
                  <input
                    type="number"
                    id="startingPrice-input"
                    aria-label="Starting Price"
                    aria-invalid={!!errors.startingPrice}
                    aria-describedby={errors.startingPrice ? "startingPrice-error" : undefined}
                    placeholder={t("fields.startingPricePlaceholder")}
                    {...register("startingPrice", { valueAsNumber: true })}
                    className={`font-poppins h-12 w-full rounded-l-lg rounded-r-none border-[1px] p-3 text-[14px] outline-none rtl:rounded-l-none rtl:rounded-r-lg 
                    ${
                      errors.startingPrice
                        ? "border-red-500 text-red-600 placeholder:text-red-400"
                        : dirtyFields.startingPrice
                          ? "border-green-500 text-green-700"
                          : "border-gray-300 text-[#ADAEBC]"
                    }`}
                  />

                  <div className="font-poppins flex h-12 w-24 items-center justify-center rounded-l-none rounded-r-lg bg-[#F9FAFB] text-[14px] font-medium text-[#4B5563] rtl:rounded-l-lg rtl:rounded-r-none">
                    {t("fields.currency")}
                  </div>

                  {errors.startingPrice ? (
                    <XCircle
                      aria-hidden="true"
                      className="absolute left-auto right-28 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500 rtl:left-28 rtl:right-auto"
                    />
                  ) : dirtyFields.startingPrice ? (
                    <CheckCircle2
                      aria-hidden="true"
                      className="absolute left-auto right-28 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500 rtl:left-28 rtl:right-auto"
                    />
                  ) : null}
                </div>

                {errors.startingPrice ? (
                  <p id="startingPrice-error" className="text-left text-xs text-red-500">
                    {errors.startingPrice.message}
                  </p>
                ) : dirtyFields.startingPrice ? (
                  <p className="text-left text-xs text-green-600">
                    {t("fields.startingPriceSuccess")}
                  </p>
                ) : null}
              </div>

              {/* Service Status */}
              <div>
                <h2 className="font-poppins text-subtext text-[16px] font-medium">
                  {t("status.label")}
                </h2>
                <div className="font-poppins flex items-center justify-between rounded-lg bg-[#F9FAFB] p-2 text-[14px] font-medium text-[#4B5563]">
                  <div className="space-y-2">
                    <h4 className="font-poppins text-[14px] font-medium text-[#374151]">
                      {status ? t("status.active") : t("status.inactive")}
                    </h4>
                    <p className="font-roboto text-[12px] font-normal text-[#6B7280]">
                      {status ? t("status.activeDesc") : t("status.inactiveDesc")}
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`w-12 rounded-full p-[2px] transition ${
                          field.value ? "bg-primaryDark" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full bg-white transition${
                            field.value ? "translate-x-6 rtl:translate-x-[-24px]" : "translate-x-0"
                          }`}
                        />
                      </button>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="w-full space-y-2 p-6">
              <label className="font-poppins flex items-center justify-start gap-2 text-[16px] font-medium text-[#374151]">
                {t("images.label")}
              </label>
              <div className="flex w-full cursor-pointer flex-col items-center justify-center space-y-3 rounded-xl border-[2px] border-dotted border-gray-300 py-10 transition hover:border-gray-400">
                {imagePreviews.length > 0 ? (
                  <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {imagePreviews.map((src, i) => (
                      <Image
                        key={i}
                        src={src}
                        alt={`Service Image ${i + 1}`}
                        width={100}
                        height={100}
                        className="h-24 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-center md:text-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F8F8]">
                      <Upload className="mb-2 h-6 w-6" />
                    </div>
                    <p className="text-[#4B5563]">{t("images.dropText")}</p>
                    <p className="text-sm text-[#9CA3AF]">{t("images.note")}</p>
                  </div>
                )}

                <button
                  type="button"
                  aria-label="Choose File"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-lg border border-gray-200 px-6 py-2"
                >
                  {t("images.chooseFile")}
                </button>
              </div>
              <p className="font-roboto text-primaryDark text-[12px] font-normal">
                {t("images.tip")}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />

              {errors.images && <p className="text-xs text-red-500">{errors.images.message}</p>}
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-200 p-6 pt-5">
              <button
                type="button"
                aria-label="Close Modal"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-6 py-2 text-[#374151] hover:bg-gray-300"
              >
                {t("buttons.cancel")}
              </button>
              <button
                type="submit"
                aria-label="Save Service"
                className="bg-primary hover:bg-btnHover rounded-lg px-8 py-2 text-white shadow-md"
              >
                {t("buttons.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
