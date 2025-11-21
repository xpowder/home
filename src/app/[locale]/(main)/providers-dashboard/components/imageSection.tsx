"use client";

import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

import { logger } from "@/lib/logger";
import { cardHeading } from "@/utils/fonts";

export default function ImageSection() {
  const t = useTranslations("providersDashboard.portfolio");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const handleClick = (index: number) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className={`${cardHeading} text-[#111827] dark:text-white`}>{t("title")} </h2>
        <button
          onClick={openFilePicker}
          aria-label="Add Photos"
          className={`bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-[30px] min-w-[40px] cursor-pointer items-center justify-center gap-2 rounded-xl p-5 text-white shadow-md shadow-black/10 duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]`}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:block">{t("addPhotos")} </span>
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid w-full grid-cols-2 items-center justify-start gap-5 md:grid-cols-4">
        {/* Uploaded images */}
        {images.map((img, index) => (
          <div
            key={index}
            className="group relative aspect-square max-w-[298px]"
            onClick={() => handleClick(index)}
          >
            <Image src={img} alt={`Uploaded ${index}`} fill className=" rounded-xl object-cover" />

            <Trash
              onClick={(e) => {
                e.stopPropagation(); // prevent parent click from toggling twice
                logger.info("Delete Image", index);
              }}
              className={`absolute right-2 top-2 h-6 w-6 cursor-pointer
                text-red-400 transition-opacity duration-300
                ${activeIndex === index ? "opacity-100" : "opacity-0"}
                group-hover:opacity-100
              `}
            />
          </div>
        ))}
        {/* Upload Box */}
        <label
          htmlFor="image-upload"
          className="font-roboto flex aspect-square h-full w-full max-w-[298px] cursor-pointer flex-col  items-center justify-center gap-2 rounded-xl border-2 border-dotted border-[#D1D5DB] bg-[#F3F4F6]/10 text-[14px] font-normal text-[#6B7280] shadow-sm transition hover:bg-gray-50"
        >
          <Plus className="h-6 w-6" />
          {t("addPhoto")}
        </label>
        <input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden h-[298px] w-[298px]"
        />
      </div>
    </div>
  );
}
