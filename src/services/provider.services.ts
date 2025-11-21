import api from "@/lib/apiClient";

export interface ProviderFilters {
  city?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  min_reviews?: number;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface Provider {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
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
  profile_picture?: string;
  portfolio_images?: Array<{ id: string; url: string }>;
  service_images?: Array<{ id: string; url: string }>;
  rating?: number;
  review_count?: number;
}

export interface ProviderListResponse {
  status: string;
  count: number;
  limit: number;
  offset: number;
  providers: Provider[];
}

export interface ProviderDetailsResponse {
  status: string;
  provider: Provider;
}

/**
 * Search and list providers with optional filters
 */
export const searchProviders = async (filters: ProviderFilters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.city) params.append("city", filters.city);
  if (filters.category) params.append("category", filters.category);
  if (filters.min_price) params.append("min_price", filters.min_price.toString());
  if (filters.max_price) params.append("max_price", filters.max_price.toString());
  if (filters.min_reviews) params.append("min_reviews", filters.min_reviews.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.offset) params.append("offset", filters.offset.toString());

  const response = await api.get<ProviderListResponse>(
    `/profile/providers?${params.toString()}`
  );
  return response.data;
};

/**
 * Get provider details by ID
 */
export const getProviderDetails = async (providerId: string) => {
  const response = await api.get<ProviderDetailsResponse>(
    `/profile/providers/${providerId}`
  );
  return response.data;
};

/**
 * Update provider profile
 */
export const updateProviderProfile = async (data: {
  service_category?: string;
  city?: string;
  service_title?: string;
  bio?: string;
  years_experience?: number;
  starting_price_mad?: number;
  full_address?: string;
}) => {
  const response = await api.put("/profile/update-provider", data);
  return response.data;
};

/**
 * Upload provider profile photo
 */
export const uploadProfilePhoto = async (photo: File) => {
  const formData = new FormData();
  formData.append("photo", photo);
  const response = await api.post("/profile/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Upload portfolio image
 */
export const uploadPortfolioImage = async (image: File) => {
  const formData = new FormData();
  formData.append("photo", image);
  const response = await api.post("/profile/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Delete portfolio image
 */
export const deletePortfolioImage = async (imageId: string) => {
  const response = await api.delete(`/profile/delete-portfolio-image/${imageId}`);
  return response.data;
};

/**
 * Upload service photo
 */
export const uploadServicePhoto = async (photo: File) => {
  const formData = new FormData();
  formData.append("photo", photo);
  const response = await api.post("/profile/upload-service-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Delete service photo
 */
export const deleteServicePhoto = async (photoId: string) => {
  const response = await api.delete(`/profile/delete-service-photo/${photoId}`);
  return response.data;
};

/**
 * Get profile completion status
 */
export const getProfileCompletionStatus = async () => {
  const response = await api.get("/profile/completion-status");
  return response.data;
};

