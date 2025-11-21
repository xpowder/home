"use client";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

import ChevronLeft from "@/assets/services/ChevronLeft.svg";
import ChevronRight from "@/assets/services/ChevronRight.svg";
import Share from "@/assets/services/Share.svg";
import { Provider } from "@/services/provider.services";

interface ServiceDetailsCaroselProps {
  provider?: Provider;
}

export default function ServiceDetailsCarosel({
  provider,
}: ServiceDetailsCaroselProps) {
  const images = provider?.service_images?.map((img) => img.url) || 
    provider?.portfolio_images?.map((img) => img.url) || 
    ["/home/latestOffers/offer1.png"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [like, setLike] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const nextSlide = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const t = useTranslations("services.service");
  // Desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = e.clientX - startX.current;
    if (diff > 50) {
      prevSlide();
      isDragging.current = false;
    } else if (diff < -50) {
      nextSlide();
      isDragging.current = false;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff > 50) prevSlide();
    else if (diff < -50) nextSlide();
  };

  return (
    <div style={{ direction: "ltr" }} className="relative mx-auto w-full max-w-6xl">
      {/* Smooth sliding container */}
      <div
        ref={carouselRef}
        data-testid="carousel"
        className="relative aspect-[1.8] cursor-grab overflow-hidden rounded-2xl sm:aspect-[2.5]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <div key={index} className="relative h-full w-full shrink-0 overflow-hidden">
              {/* Blurred Background */}
              <Image
                src={img}
                alt={`Background ${index + 1}`}
                fill
                className="object-cover blur-sm  brightness-90"
              />

              {/* Center Image with actual aspect ratio */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={img}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="z-10 h-full w-auto rounded-xl object-contain"
                  sizes="100vw"
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 flex h-10 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 p-2 shadow-lg transition-all duration-200 hover:bg-white md:left-4"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-4 w-4 text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 flex h-10 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 p-2 shadow-lg transition-all duration-200 hover:bg-white md:right-4"
        aria-label="Next image"
      >
        <ChevronRight className="h-4 w-4 text-gray-700" />
      </button>

      {/* Action Buttons */}
      <div className="absolute right-2 top-2 flex space-x-2 sm:right-4 sm:top-4">
        <button
          className="font-poppins text-subtext flex cursor-pointer items-center gap-2 rounded-full bg-white/80 p-1 text-[clamp(12px,1vw,16px)] font-normal shadow-lg transition-all duration-200 hover:bg-white sm:p-2"
          aria-label="Share"
        >
          <Share className="h-4 w-4 text-gray-700 sm:h-5 sm:w-5" />
          {t("share")}
        </button>
        <button
          onClick={() => setLike((prev) => !prev)}
          className="cursor-pointer rounded-full bg-white/80 p-1 shadow-lg transition-all duration-200 hover:bg-white sm:p-2"
          aria-label="Love"
        >
          <Heart
            className={`${like ? "fill-red-400 text-red-400" : "text-gray-400"} h-4 w-4 sm:h-5 sm:w-5`}
          />
        </button>
      </div>
    </div>
  );
}
