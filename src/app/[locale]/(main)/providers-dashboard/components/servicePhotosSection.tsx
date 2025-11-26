"use client";

import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { logger } from "@/lib/logger";
import { getServicePhotos, ServicePhoto } from "@/services/profile.services";
import { uploadServicePhoto, deleteServicePhoto } from "@/services/provider.services";
import { toast } from "sonner";
import { cardHeading } from "@/utils/fonts";

export default function ServicePhotosSection() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const MAX_PHOTOS = 3;

  useEffect(() => {
    fetchServicePhotos();
  }, []);

  const fetchServicePhotos = async () => {
    try {
      setLoading(true);
      const response = await getServicePhotos();
      logger.info("Service photos response:", response);
      const photosList = response.service_photos || [];
      logger.info("Service photos list:", photosList);
      setPhotos(photosList);
    } catch (error) {
      logger.error("Error fetching service photos:", error);
      toast.error("Failed to load service photos.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (index: number) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these photos would exceed the limit
    if (photos.length + files.length > MAX_PHOTOS) {
      toast.error(`You can only upload up to ${MAX_PHOTOS} service photos.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    try {
      // Upload each file sequentially
      for (const file of Array.from(files)) {
        await uploadServicePhoto(file);
      }
      
      // Wait a bit before refreshing to ensure backend has processed
      setTimeout(async () => {
        await fetchServicePhotos();
      }, 500);
      
      toast.success("Service photos uploaded successfully!");
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      logger.error("Error uploading service photos:", error);
      toast.error("Failed to upload service photos. Please try again.");
      // Still try to refresh in case some photos were uploaded
      await fetchServicePhotos();
    }
  };

  const handleDeletePhoto = async (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deleteServicePhoto(photoId);
      // Remove from local state
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
      toast.success("Service photo deleted successfully!");
    } catch (error) {
      logger.error("Error deleting service photo:", error);
      toast.error("Failed to delete service photo. Please try again.");
    }
  };

  const openFilePicker = () => {
    if (photos.length >= MAX_PHOTOS) {
      toast.error(`You can only upload up to ${MAX_PHOTOS} service photos.`);
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className={`${cardHeading} text-[#111827] dark:text-white`}>
          Service Photos
        </h2>
        {photos.length < MAX_PHOTOS && (
          <button
            onClick={openFilePicker}
            aria-label="Add Service Photos"
            className="bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-[30px] min-w-[40px] cursor-pointer items-center justify-center gap-2 rounded-xl p-5 text-white shadow-md shadow-black/10 duration-300 hover:translate-y-[-1px] hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:block">Add Photos</span>
          </button>
        )}
      </div>

      {/* Photo Grid */}
      <div className="grid w-full grid-cols-2 items-center justify-start gap-5 md:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <div className="text-subtext">Loading service photos...</div>
          </div>
        ) : (
          <>
            {/* Uploaded photos */}
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-square max-w-[298px]"
                onClick={() => handleClick(index)}
              >
                <Image 
                  src={photo.url} 
                  alt={`Service photo ${index + 1}`} 
                  fill 
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 298px"
                  className="rounded-xl object-cover" 
                />

                <Trash
                  onClick={(e) => handleDeletePhoto(photo.id, e)}
                  className={`absolute right-2 top-2 h-6 w-6 cursor-pointer
                    text-red-400 transition-opacity duration-300
                    ${activeIndex === index ? "opacity-100" : "opacity-0"}
                    group-hover:opacity-100
                  `}
                />
              </div>
            ))}
            
            {/* Upload Box - only show if under limit */}
            {photos.length < MAX_PHOTOS && (
              <label
                htmlFor="service-photo-upload"
                className="font-roboto flex aspect-square h-full w-full max-w-[298px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dotted border-[#D1D5DB] bg-[#F3F4F6]/10 text-[14px] font-normal text-[#6B7280] shadow-sm transition hover:bg-gray-50"
              >
                <Plus className="h-6 w-6" />
                Add Photo
                <span className="text-xs text-gray-400">
                  ({photos.length}/{MAX_PHOTOS})
                </span>
              </label>
            )}
          </>
        )}
        <input
          ref={fileInputRef}
          id="service-photo-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>
      
      {photos.length >= MAX_PHOTOS && (
        <p className="text-subtext text-sm text-center">
          Maximum {MAX_PHOTOS} service photos allowed. Delete a photo to upload a new one.
        </p>
      )}
    </div>
  );
}

