"use client";

import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import { logger } from "@/lib/logger";
import { getPortfolioImages, PortfolioImage } from "@/services/profile.services";
import { uploadServicePhoto, deletePortfolioImage } from "@/services/provider.services";
import { toast } from "sonner";
import { cardHeading } from "@/utils/fonts";

export default function ImageSection() {
  const t = useTranslations("providersDashboard.portfolio");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    fetchPortfolioImages();
  }, []);

  const fetchPortfolioImages = async () => {
    try {
      setLoading(true);
      const response = await getPortfolioImages();
      setImages(response.portfolio_images || []);
    } catch (error) {
      logger.error("Error fetching portfolio images:", error);
      toast.error("Failed to load portfolio images.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (index: number) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Upload each file
      for (const file of Array.from(files)) {
        await uploadServicePhoto(file);
      }
      
      // Refresh the images list
      await fetchPortfolioImages();
      toast.success("Images uploaded successfully!");
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      logger.error("Error uploading images:", error);
      toast.error("Failed to upload images. Please try again.");
    }
  };

  const handleDeleteImage = async (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deletePortfolioImage(imageId);
      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Image deleted successfully!");
    } catch (error) {
      logger.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className={`${cardHeading} text-[#111827] dark:text-white`}>{t("title")} </h2>
        {images.length === 0 && (
          <button
            onClick={openFilePicker}
            aria-label="Add Photos"
            className={`bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-[30px] min-w-[40px] cursor-pointer items-center justify-center gap-2 rounded-xl p-5 text-white shadow-md shadow-black/10 duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]`}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:block">{t("addPhotos")} </span>
          </button>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid w-full grid-cols-2 items-center justify-start gap-5 md:grid-cols-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <div className="text-subtext">Loading images...</div>
          </div>
        ) : (
          <>
            {/* Uploaded images */}
            {images.map((img, index) => (
              <div
                key={img.id}
                className="group relative aspect-square max-w-[298px]"
                onClick={() => handleClick(index)}
              >
                <Image 
                  src={img.url} 
                  alt={img.filename || `Portfolio image ${index + 1}`} 
                  fill 
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 298px"
                  className="rounded-xl object-cover" 
                />

                <Trash
                  onClick={(e) => handleDeleteImage(img.id, e)}
                  className={`absolute right-2 top-2 h-6 w-6 cursor-pointer
                    text-red-400 transition-opacity duration-300
                    ${activeIndex === index ? "opacity-100" : "opacity-0"}
                    group-hover:opacity-100
                  `}
                />
              </div>
            ))}
            
            {/* Upload Box - only show when no images */}
            {images.length === 0 && (
              <label
                htmlFor="image-upload"
                className="font-roboto flex aspect-square h-full w-full max-w-[298px] cursor-pointer flex-col  items-center justify-center gap-2 rounded-xl border-2 border-dotted border-[#D1D5DB] bg-[#F3F4F6]/10 text-[14px] font-normal text-[#6B7280] shadow-sm transition hover:bg-gray-50"
              >
                <Plus className="h-6 w-6" />
                {t("addPhoto")}
              </label>
            )}
          </>
        )}
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
