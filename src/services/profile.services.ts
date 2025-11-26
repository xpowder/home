import api from "@/lib/apiClient";

export interface ProfileData {
  id: string;
  email: string;
  role: "provider" | "client";
  service_category?: {
    en: string;
    fr: string;
    ar: string;
  };
  city?: {
    en: string;
    fr: string;
    ar: string;
  };
  service_title?: string;
  bio?: string;
  years_experience?: number;
  starting_price_mad?: number;
  full_address?: string;
  is_active_provider: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_picture?: string;
}

export interface PortfolioImage {
  id: string;
  url: string;
  filename?: string;
  uploaded_at?: string;
  created_at?: string;
}

export interface ServicePhoto {
  id: string;
  url: string;
  created_at: string;
}

export interface ProfileCompletionStatus {
  completion_percentage: number;
  missing_fields: string[];
  completed_sections: string[];
  next_steps: string[];
}

export const getMyProfile = async () => {
  const response = await api.get<{ status: string; user: ProfileData }>(
    "/profile/my-profile"
  );
  // Backend should return absolute URL, but ensure it's absolute as fallback
  if (response.data.user?.profile_picture) {
    const profilePic = response.data.user.profile_picture;
    if (profilePic && typeof profilePic === 'string' && !profilePic.startsWith("http")) {
      // Only convert if it's relative (backend should return absolute now)
      const baseUrl = process.env.NEXT_PUBLIC_TEST_BACKEND_LOCALLY === "true"
        ? "http://localhost:8000"
        : process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";
      response.data.user.profile_picture = profilePic.startsWith("/") 
        ? `${baseUrl}${profilePic}`
        : `${baseUrl}/media/${profilePic}`;
    }
  }
  return response.data;
};

export const getPortfolioImages = async () => {
  const response = await api.get<{
    status: string;
    portfolio_images: PortfolioImage[];
  }>("/profile/get-portfolio-images");
  return response.data;
};

export const getServicePhotos = async () => {
  const response = await api.get<{
    status: string;
    service_photos: ServicePhoto[];
  }>("/profile/get-service-photos");
  
  // Backend should return absolute URLs, but ensure they're absolute as fallback
  if (response.data.service_photos && Array.isArray(response.data.service_photos)) {
    const baseUrl = process.env.NEXT_PUBLIC_TEST_BACKEND_LOCALLY === "true"
      ? "http://localhost:8000"
      : process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";
    
    response.data.service_photos = response.data.service_photos.map((photo) => {
      if (!photo.url) return photo;
      
      // If already absolute, use as-is (backend should return this now)
      if (photo.url.startsWith("http://") || photo.url.startsWith("https://")) {
        return photo;
      }
      
      // Fallback: Convert relative URL to absolute
      let photoUrl = photo.url;
      if (!photoUrl.startsWith("/")) {
        photoUrl = `/media/${photoUrl}`;
      }
      
      return {
        ...photo,
        url: `${baseUrl}${photoUrl}`,
      };
    });
  }
  
  return response.data;
};

export const getProfileCompletionStatus = async () => {
  const response = await api.get<{
    status: string;
    profile_completion: ProfileCompletionStatus;
  }>("/profile/completion-status");
  return response.data;
};
