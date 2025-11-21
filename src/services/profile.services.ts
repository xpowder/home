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
}

export interface PortfolioImage {
  id: string;
  url: string;
  created_at: string;
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
  return response.data;
};

export const getProfileCompletionStatus = async () => {
  const response = await api.get<{
    status: string;
    profile_completion: ProfileCompletionStatus;
  }>("/profile/completion-status");
  return response.data;
};
