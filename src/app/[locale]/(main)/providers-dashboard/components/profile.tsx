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
import { getMyProfile, getProfileCompletionStatus } from "@/services/profile.services";
import { type EditProfileFormType } from "@/validation/providerDashboard/editProfileSchema";
import { toast } from "sonner";
import useCatagory from "@/hooks/useCatagory";
import useCity from "@/hooks/useCity";
import { useParams } from "next/navigation";

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

// Will be fetched from API
const initialUserRelatedData: UserRelatedData = {
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
  startingPrice: undefined,
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
  const [userRelatedData, setUserRelatedData] = useState<UserRelatedData>(initialUserRelatedData);
  const [displayNames, setDisplayNames] = useState<{
    profession: string;
    city: string;
  }>({
    profession: "",
    city: "",
  });
  const t = useTranslations("providersDashboard.profile");
  const params = useParams();
  const locale = params.locale as string;
  const { categories } = useCatagory();
  const { cities } = useCity();

  // ✅ Similar to MyServices' handleSaveService
  const handleEditSave = async (updatedData: EditProfileFormType) => {
    setUserData((prev) => ({
      ...prev,
      ...updatedData,
    }));
    
    // Update display names from the updated data
    if (updatedData.profession) {
      const newProfessionName = getCategoryDisplayName(updatedData.profession);
      if (newProfessionName) {
        setDisplayNames(prev => ({ ...prev, profession: newProfessionName }));
      }
    }
    if (updatedData.city) {
      const newCityName = getCityDisplayName(updatedData.city);
      if (newCityName) {
        setDisplayNames(prev => ({ ...prev, city: newCityName }));
      }
    }
    
    setIsEditing(false);
    // Refresh profile data after save
    await fetchUserData();
  };

  const fetchUserData = async () => {
    try {
      const res = await getMyProfile();
      logger.info("Fetched user profile data:", res);
      
      // Fetch profile completion status
      try {
        const completionRes = await getProfileCompletionStatus();
        if (completionRes.profile_completion) {
          const completion = completionRes.profile_completion;
          const percentage = completion.completion_percentage || 0;
          
          // Format missing fields message
          let missingFieldsMessage = "";
          if (completion.missing_fields && completion.missing_fields.length > 0) {
            // Format field names to be more readable
            const formattedFields = completion.missing_fields.map((field: string) => {
              // Map backend field names to user-friendly names
              const fieldMap: Record<string, string> = {
                profile_picture: "profile picture",
                portfolio_images: "service images",
                service_images: "service images",
                email_verification: "email verification",
                first_name: "first name",
                last_name: "last name",
                service_category: "service category",
                service_title: "service title",
                years_experience: "years experience",
                service_price_mad: "starting price",
                full_address: "full address",
              };
              
              // Use mapped name or convert snake_case to readable format
              return fieldMap[field] || field
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .toLowerCase();
            });
            missingFieldsMessage = `Complete missing fields: ${formattedFields.join(', ')}`;
          }
          
          setUserRelatedData((prev) => ({
            ...prev,
            profileCompletion: percentage,
            profileCompletionMessage: missingFieldsMessage || completion.next_steps?.[0] || prev.profileCompletionMessage,
          }));
        }
      } catch (error) {
        logger.error("Error fetching profile completion:", error);
      }
      
      // Update userData with fetched profile data
      if (res.user) {
        // Get profile photo URL - check if it's in the response or needs to be fetched
        const profilePhotoUrl = (res.user as any).profile_picture;
        
        // Map category name to ID
        const categoryName = res.user.service_category?.en || res.user.service_category?.fr || res.user.service_category?.ar;
        let categoryId = "";
        if (categoryName && categories && categories.length > 0) {
          const foundCategory = categories.find(
            (cat) => cat.name_en === categoryName || 
                     cat.name_fr === categoryName || 
                     cat.name_ar === categoryName ||
                     cat[`name_${locale}` as keyof typeof cat] === categoryName
          );
          if (foundCategory && foundCategory.id) {
            categoryId = foundCategory.id;
          }
        }
        
        // Map city name to ID
        const cityName = res.user.city?.en || res.user.city?.fr || res.user.city?.ar;
        let cityId = "";
        if (cityName && cities && cities.length > 0) {
          const foundCity = cities.find(
            (cityItem) => cityItem.name_en === cityName || 
                         cityItem.name_fr === cityName || 
                         cityItem.name_ar === cityName ||
                         cityItem[`name_${locale}` as keyof typeof cityItem] === cityName
          );
          if (foundCity && foundCity.id) {
            cityId = foundCity.id;
          }
        }
        
        // Get display names from API response (these are the names, not IDs)
        const professionDisplayName = categoryName || "";
        const cityDisplayName = cityName || "";
        
        setUserData((prev) => ({
          ...prev,
          fullName: res.user.service_title || `${res.user.first_name || ""} ${res.user.last_name || ""}`.trim() || "Provider",
          profession: categoryId || "", // Store ID for form submission
          city: cityId || "", // Store ID for form submission
          bio: res.user.bio || "",
          experience: res.user.years_experience ? `${res.user.years_experience} years` : "0 years",
          startingPrice: res.user.starting_price_mad ? Number(res.user.starting_price_mad) : undefined,
          phone: res.user.phone || "",
          email: res.user.email || "",
          profileImage: profilePhotoUrl || (res.user as any).profile_picture || prev.profileImage,
        }));
        
        // Store display names separately for UI display
        setDisplayNames({
          profession: professionDisplayName,
          city: cityDisplayName,
        });
      }
    } catch (error) {
      logger.error("Error fetching user profile data:", error);
      toast.error("Failed to load profile data.");
    }
  };

  // Helper functions to get display names from IDs
  const getCategoryDisplayName = (categoryId: string) => {
    if (!categoryId || !categories) return "";
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
    if (!isValidUUID) return categoryId; // If it's already a name, return it
    
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      return category[`name_${locale}` as keyof typeof category] as string || category.name_en || "";
    }
    return "";
  };

  const getCityDisplayName = (cityId: string) => {
    if (!cityId || !cities) return "";
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cityId);
    if (!isValidUUID) return cityId; // If it's already a name, return it
    
    const city = cities.find(cityItem => cityItem.id === cityId);
    if (city) {
      return city[`name_${locale}` as keyof typeof city] as string || city.name_en || "";
    }
    return "";
  };

  useEffect(() => {
    // Only fetch when categories and cities are loaded (needed to map names to IDs)
    if (categories && cities) {
      fetchUserData();
    }
  }, [categories, cities]);

  return (
    <section aria-label="User Profile Section" className="relative my-6 px-4 sm:my-8 sm:px-6 md:my-12 md:px-8 lg:my-16">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white dark:bg-gray-900 flex flex-col gap-4 sm:gap-6 rounded-xl p-4 sm:p-6 lg:p-8 shadow-md border border-gray-100 dark:border-gray-800">
          {/* Header: Image + Info */}
          <div
            role="region"
            aria-label="Profile Header"
            className="flex h-full w-full flex-col items-start justify-between gap-5 lg:flex-row lg:items-center"
          >
            {/* Left: Image + Basic Info */}
            <div className="flex h-full w-full flex-row items-center justify-start gap-3 sm:gap-4 md:gap-5">
              <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full flex-shrink-0">
                <Image
                  src={
                    userData.profileImage
                      ? typeof userData.profileImage === "string"
                        ? userData.profileImage
                        : URL.createObjectURL(userData.profileImage)
                      : ProfileImage
                  }
                  alt={userData.fullName || "Profile"}
                  height={96}
                  width={96}
                  className="rounded-full object-cover"
                />
                {userRelatedData.isVerified && (
                  <TickRound className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7" />
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col items-start justify-center gap-2">
                <h2 className={`font-poppins text-heading text-xl font-bold sm:text-2xl`}>
                  {userData.fullName}
                </h2>

                <div className="flex flex-col items-start justify-start gap-1 sm:flex-row sm:gap-3">
                  <div className="font-inter flex items-center justify-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Wrange className="h-4 w-4" />
                    {displayNames.profession || getCategoryDisplayName(userData.profession) || "Not set"}
                  </div>
                  <div className="font-inter flex items-center justify-center gap-1 text-sm font-normal text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {displayNames.city || getCityDisplayName(userData.city) || "Not set"}
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-inter text-sm font-semibold text-gray-900 dark:text-white">
                      {userRelatedData.rating.score}
                    </span>
                    <span className="font-inter text-sm font-normal text-gray-600 dark:text-gray-400">
                      ({userRelatedData.rating.reviews} {t("reviews")})
                    </span>
                  </div>
                  <div className="font-inter flex items-center justify-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    {t("memberSince")} {userRelatedData.memberSince}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex h-full w-full flex-col items-stretch justify-end gap-2 self-end sm:flex-row sm:w-auto sm:items-center lg:flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Edit Profile"
                className="font-roboto flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#E5E7EB] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#374151] dark:text-gray-200 transition-all hover:bg-[#F3F4F6] dark:hover:bg-gray-700 hover:shadow-sm active:shadow-none"
              >
                <Edit className="h-4 w-4 text-[#6B7280] dark:text-gray-400" />
                <span>{t("edit")}</span>
              </button>

              <button
                aria-label="View Public Profile"
                className="font-roboto w-full cursor-pointer whitespace-nowrap rounded border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6] sm:w-auto"
              >
                {t("view")}
              </button>
              <button
                aria-label="Request Verification"
                className="bg-primary font-roboto w-full cursor-pointer whitespace-nowrap rounded px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primaryDark sm:w-auto"
              >
                {t("requestVerification")}
              </button>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="w-full space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4" role="region" aria-label="Profile Completion">
            <div className="flex w-full items-center justify-between">
              <h3 className="font-roboto text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("profileCompletion") || "Profile Completion"}
              </h3>
              <h3 className="font-roboto text-primary text-sm font-medium">
                {userRelatedData.profileCompletion}% {t("complete") || "complete"}
              </h3>
            </div>
            <div className="flex h-2 w-full items-center justify-start rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${userRelatedData.profileCompletion}%` }}
              />
            </div>
            {userRelatedData.profileCompletionMessage && (
              <p className="font-roboto text-xs font-normal text-gray-600 dark:text-gray-400">
                {userRelatedData.profileCompletionMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Edit Profile Modal */}
      {isEditing && (
        <EditProfileModal
          onClose={() => setIsEditing(false)}
          defaultValues={userData}
          onSave={handleEditSave}
          onProfileUpdate={fetchUserData}
        />
      )}
    </section>
  );
}
