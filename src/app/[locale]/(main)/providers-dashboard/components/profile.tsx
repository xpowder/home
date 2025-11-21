"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import MapPin from "@/assets/home/offers/MapPin.svg";
import Star from "@/assets/home/offers/Star.svg";
import Edit from "@/assets/providerDashboard/Edit.svg";
import ProfileImage from "@/assets/providerDashboard/mainImage.png";
import TickRound from "@/assets/providerDashboard/TickRound.svg";
import Wrange from "@/assets/providerDashboard/WrangeBlue.svg";
import { logger } from "@/lib/logger";
import { getMyProfile } from "@/services/profile.services";
import { type EditProfileFormType } from "@/validation/providerDashboard/editProfileSchema";

const EditProfileModal = dynamic(
  () => import("./editProfile"),
  { ssr: false } // ❗ Prevent SSR because the modal uses client-side hooks
);

interface Rating {
  score: number;
  reviews: number;
}

interface UserRelatedData {
  isVerified: boolean;
  rating: Rating;
  memberSince: number;
  profileCompletion: number;
  profileCompletionMessage: string;
}

const userRelatedData: UserRelatedData = {
  isVerified: true,
  rating: { score: 4.8, reviews: 127 },
  memberSince: 2023,
  profileCompletion: 80,
  profileCompletionMessage: "Add photos to get more clients and boost your visibility",
};

// ✅ initial user data
const initialUserData: EditProfileFormType = {
  fullName: "Youssef Plumbing",
  profileImage: null,
  profession: "Plumber",
  city: "Rabat, Morocco",
  bio: "Experienced plumber offering quality installation and repair services.",
  serviceArea: "Rabat & nearby regions",
  experience: "5 years",
  languages: ["English", "Arabic", "French"],
  phone: "123456789",
  whatsapp: "123456789",
  email: "youssef@example.com",
  serviceImage: null,
  portfolioImages: [],
};

export default function Profile() {
  const [userData, setUserData] = useState<EditProfileFormType>(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations("providersDashboard.profile");

  // ✅ Similar to MyServices' handleSaveService
  const handleEditSave = (updatedData: EditProfileFormType) => {
    setUserData((prev) => ({
      ...prev,
      ...updatedData,
    }));
    setIsEditing(false);
  };

  const fetchUserData = async () => {
    try {
      const res = await getMyProfile();
      logger.info("Fetched user profile data:", res);
      // Update userData with fetched profile data
      if (res.user) {
        setUserData((prev) => ({
          ...prev,
          fullName: res.user.service_title || `${res.user.first_name || ""} ${res.user.last_name || ""}`.trim() || "Provider",
          profession: res.user.service_category?.en || res.user.service_category?.fr || res.user.service_category?.ar || "Service Provider",
          city: res.user.city?.en || res.user.city?.fr || res.user.city?.ar || "Location",
          bio: res.user.bio || "",
          experience: res.user.years_experience ? `${res.user.years_experience} years` : "0 years",
          phone: res.user.phone || "",
          email: res.user.email || "",
        }));
      }
    } catch (error) {
      logger.error("Error fetching user profile data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <section aria-label="User Profile Section" className=" relative my-8 px-5 md:my-16">
      <div className="container">
        <div className="shadow-foreground/20 bg-secondary/10 flex flex-col gap-6 rounded-xl p-5 shadow-md">
          {/* Header: Image + Info */}
          <div
            role="region"
            aria-label="Profile Header"
            className="flex h-full w-full flex-col items-start justify-between gap-5 xl:flex-row xl:items-center"
          >
            {/* Left: Image + Basic Info */}
            <div className="flex h-full w-full flex-row items-center justify-start gap-5 text-center">
              <div className="shadow-foreground/20 relative flex h-20 w-20 items-center justify-center rounded-full p-1 shadow-md sm:h-32 sm:w-32">
                <Image
                  src={
                    userData.profileImage
                      ? typeof userData.profileImage === "string"
                        ? userData.profileImage
                        : URL.createObjectURL(userData.profileImage)
                      : ProfileImage
                  }
                  alt={userData.fullName}
                  height={128}
                  width={128}
                  className="rounded-full"
                />
                {userRelatedData.isVerified && (
                  <TickRound className="absolute bottom-1 right-2 h-4 w-4 sm:h-6 sm:w-6" />
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col items-start justify-center gap-3">
                <div className="flex items-start justify-start gap-3">
                  <h2 className={`font-poppins text-heading text-[clamp(15px,2vw,32px)] font-bold`}>
                    {userData.fullName}
                  </h2>
                </div>

                <div className="flex  flex-col items-start justify-start gap-2 sm:flex-row">
                  <div className="font-inter flex items-center justify-center gap-1 text-[clamp(12px,1vw,16px)] font-medium">
                    <Wrange className="h-2 min-h-2 w-2 min-w-2 md:h-4 md:w-4" />
                    {userData.profession}
                  </div>
                  <div className="font-inter flex items-center justify-center gap-1 text-[clamp(12px,1vw,16px)] font-normal">
                    <MapPin className="h-2 min-h-2 w-2 min-w-2 md:h-4 md:w-4" />
                    {userData.city}
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-3 sm:flex-row">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-2 min-h-2 w-2 min-w-2 md:h-4 md:w-4" />
                    <span className="font-inter text-[clamp(12px,1vw,16px)] font-semibold">
                      {userRelatedData.rating.score}
                    </span>
                    <span className="font-inter text-[clamp(12px,1vw,16px)] font-normal">
                      ({userRelatedData.rating.reviews} {t("reviews")})
                    </span>
                  </div>
                  <div className="font-inter flex items-center justify-center gap-2 text-[clamp(12px,1vw,16px)] font-normal">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    {t("memberSince")} {userRelatedData.memberSince}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex h-full w-full flex-col items-end justify-end gap-5 self-end sm:flex-row ">
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Edit Profile"
                className="font-roboto text-heading/70 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#D1D5DB] px-4 py-2 text-[clamp(12px,1vw,16px)] font-medium transition duration-300 hover:-translate-y-px sm:w-auto"
              >
                <Edit className="h-4 w-4" />
                {t("edit")}
              </button>

              <button
                aria-label="View Public Profile"
                className="font-roboto text-subtext bg-subtextSection/30 w-full cursor-pointer rounded-md px-4 py-2 text-[clamp(12px,1vw,16px)] font-medium duration-300 hover:-translate-y-px sm:w-auto"
              >
                {t("view")}
              </button>
              <button
                aria-label="Request Verification"
                className=" bg-primary font-roboto w-full cursor-pointer rounded-md px-4 py-2 text-[clamp(12px,1vw,16px)] font-medium text-white duration-300 hover:-translate-y-px sm:w-auto"
              >
                {t("requestVerification")}
              </button>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="w-full space-y-2" role="region" aria-label="Profile Completion">
            <div className="flex w-full items-center justify-between">
              <h3 className="font-roboto text-[clamp(12px,1vw,16px)] font-medium text-[#374151] dark:text-white">
                {t("profileCompletion")}
              </h3>
              <h3 className="font-roboto text-primary text-[clamp(12px,1vw,16px)] font-medium">
                {userRelatedData.profileCompletion}% {t("complete")}
              </h3>
            </div>
            <div className="flex h-[clamp(4px,1vw,8px)] w-full items-center justify-start rounded-full bg-[#E5E7EB]">
              <div
                className={`bg-primaryDark h-[clamp(4px,1vw,8px)] rounded-full`}
                style={{ width: `${userRelatedData.profileCompletion}%` }}
              />
            </div>
            <p className="font-roboto text-[clamp(10px,1vw,14px)] font-normal text-[#4B5563] dark:text-white">
              {userRelatedData.profileCompletionMessage}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Edit Profile Modal */}
      {isEditing && (
        <EditProfileModal
          onClose={() => setIsEditing(false)}
          defaultValues={userData}
          onSave={handleEditSave}
        />
      )}
    </section>
  );
}
