"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import Star from "@/assets/home/offers/Star.svg";
import ArrowRight from "@/assets/services/ArrowRight.svg";
import StarEmpty from "@/assets/services/StarEmpty.svg";
import { getProviderReviews, Review } from "@/services/review.services";
import { logger } from "@/lib/logger";

interface WhatOthersSayProps {
  providerId?: string;
}

export default function WhatOthersSay({ providerId }: WhatOthersSayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!providerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getProviderReviews(providerId, 1, 2);
        setReviews(response.reviews || []);
        setReviewCount(response.total || 0);
      } catch (error) {
        logger.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [providerId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };
  // Format name as "Firstname L."
  const formatName = (name?: string): string => {
    if (!name) return "Anonymous";
    const [first = "", second = ""] = name.trim().split(" ");
    return `${first[0]?.toUpperCase()}${first.slice(1).toLowerCase()}${second ? " " + second[0].toUpperCase() + "." : ""}`;
  };
  const t = useTranslations("services.service.review");

  if (loading) {
    return (
      <div className="pb-15 dark:bg-secondary space-y-10 rounded-xl bg-white p-5">
        <div className="flex items-center justify-center py-8">
          <div className="text-subtext">Loading reviews...</div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="pb-15 dark:bg-secondary space-y-10 rounded-xl bg-white p-5">
        <h2 className="font-poppins text-heading text-[clamp(14px,1vw,20px)] font-semibold">
          {t("title")}
        </h2>
        <p className="text-subtext">No reviews yet. Be the first to review this provider!</p>
      </div>
    );
  }

  return (
    // Main review section container
    <div
      className="pb-15 dark:bg-secondary space-y-10 rounded-xl bg-white p-5"
      role="region"
      aria-label="What others say about service"
    >
      {/* Header with section title and 'See all reviews' button */}
      <div className="flex items-center justify-between">
        <h2
          className="font-poppins text-heading text-[clamp(14px,1vw,20px)] font-semibold"
          id="reviews-heading"
        >
          {t("title")}
        </h2>

        {reviewCount > reviews.length && (
          <button
            className="font-roboto text-primary flex cursor-pointer items-center justify-center gap-3 text-[clamp(10px,1vw,14px)] font-medium"
            aria-label={`See all ${reviewCount} reviews`}
          >
            {t("seeAll")} {reviewCount} {t("reviews")}
            <ArrowRight
              className="h-[clamp(8px,1vw,16px)] min-h-2 w-[clamp(8px,1vw,16px)] min-w-2"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* Reviews list */}
      <div
        className="space-y-8"
        role="list"
        aria-labelledby="reviews-heading"
      >
        {reviews.map((item) => (
          <div
            key={item.id}
            className="space-y-3"
            role="listitem"
            aria-label={`Review by ${item.client_name || "Anonymous"}`}
          >
            {/* Star rating display */}
            <div
              className="flex items-center justify-start gap-1"
              aria-label={`Rated ${item.rating} out of 5`}
            >
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center"
                  role="img"
                  aria-label={idx + 1 <= item.rating ? "Full star" : "Empty star"}
                >
                  {idx + 1 <= item.rating ? (
                    <Star
                      className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <StarEmpty
                      className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
              {/* Numeric rating */}
              <span
                className="font-roboto text-heading text-[clamp(12px,1vw,16px)] font-normal"
                aria-label={`Rating: ${Number(item.rating).toFixed(1)} out of 5`}
              >
                {Number(item.rating).toFixed(1)}
              </span>
            </div>

            {/* Review message text */}
            {item.comment && (
              <div
                className="font-roboto text-subtext text-[clamp(12px,1vw,16px)] font-normal"
                aria-label="Review message"
              >
                &quot;{item.comment}&quot;
              </div>
            )}

            {/* Reviewer info section */}
            <div
              className="flex items-center justify-start gap-2"
              aria-label={`Reviewer: ${formatName(item.client_name)}, Reviewed ${formatDate(item.created_at)}`}
            >
              <span className="font-roboto text-subtext text-[clamp(10px,1vw,14px)] font-medium">
                {formatName(item.client_name)}
              </span>
              <div className="bg-subtext h-1 w-1 rounded-full" aria-hidden="true" />
              <span className="font-roboto text-subtext text-[clamp(10px,1vw,14px)] font-normal">
                {formatDate(item.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
