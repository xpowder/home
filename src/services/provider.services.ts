import api from "@/lib/apiClient";
import { env } from "@/lib/env";

/**
 * Ensure image URL is absolute (backend should return absolute URLs now)
 * This is kept as a fallback for backward compatibility
 */
const ensureAbsoluteUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  // If already absolute URL, return as is (backend should always return this now)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // Fallback: Convert relative URL to absolute (shouldn't be needed if backend is fixed)
  let baseUrl: string;
  if (env.NEXT_PUBLIC_TEST_BACKEND_LOCALLY === "true") {
    baseUrl = "http://localhost:8000";
  } else {
    const apiUrl = env.NEXT_PUBLIC_BACKEND_API_URL;
    baseUrl = apiUrl.replace(/\/api\/?$/, "");
  }
  
  let photoUrl = url;
  if (!photoUrl.startsWith("/")) {
    photoUrl = `/media/${photoUrl}`;
  }
  
  return `${baseUrl}${photoUrl}`;
};

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
  email?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: "provider" | "client";
  service_category?: {
    en: string;
    fr: string;
    ar: string;
  } | null;
  city?: {
    en: string;
    fr: string;
    ar: string;
  } | null;
  service_title?: string;
  bio?: string;
  years_experience?: number;
  starting_price_mad?: number;
  full_address?: string;
  is_active_provider?: boolean;
  profile_picture?: string | null;
  portfolio_images?: Array<{ id: string; url: string }>;
  service_images?: Array<string> | Array<{ id: string; url: string }>;
  // Backend returns average_rating and total_reviews
  average_rating?: number;
  total_reviews?: number;
  // Frontend uses rating and review_count (mapped from above)
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

  try {
    const response = await api.get<ProviderListResponse>(
      `/profile/providers?${params.toString()}`
    );
    
    // Ensure we return the data in the expected format
    const data = response.data;
    
    // Handle both direct response and nested data
    if (data && typeof data === 'object') {
      // Map backend response to frontend format
      // Backend now returns absolute URLs, but we ensure they're absolute as a fallback
      const providers = (data.providers || []).map((provider: any) => {
        // Ensure profile picture is absolute (backend should return absolute URL)
        const profilePicture = ensureAbsoluteUrl(provider.profile_picture);
        
        // Ensure service images are absolute URLs
        const serviceImages = Array.isArray(provider.service_images) 
          ? provider.service_images.map((img: any) => {
              if (typeof img === 'string') {
                return ensureAbsoluteUrl(img) || img;
              }
              if (img?.url) {
                return ensureAbsoluteUrl(img.url) || img.url;
              }
              return img;
            })
          : [];
        
        return {
          ...provider,
          // Map backend fields to frontend expected fields
          rating: provider.average_rating ?? provider.rating ?? 0,
          review_count: provider.total_reviews ?? provider.review_count ?? 0,
          // URLs should already be absolute from backend
          profile_picture: profilePicture,
          service_images: serviceImages,
        };
      });
      
      return {
        status: data.status || "success",
        count: data.count || 0,
        limit: data.limit || filters.limit || 50,
        offset: data.offset || filters.offset || 0,
        providers,
      };
    }
    
    return {
      status: "success",
      count: 0,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      providers: [],
    };
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching providers:", error);
    throw error;
  }
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
 * Endpoint: PUT /api/profile/update-provider
 * Base URL: https://backend-homezup-production.up.railway.app/api
 * Full URL: https://backend-homezup-production.up.railway.app/api/profile/update-provider
 * 
 * Request body:
 * {
 *   service_category?: string;
 *   city?: string;
 *   service_title?: string;
 *   bio?: string;
 *   years_experience?: number;
 *   starting_price_mad?: number;
 *   full_address?: string;
 *   is_active_provider?: boolean;
 * }
 * 
 * Response:
 * {
 *   status: "success";
 *   message: string;
 *   user: {
 *     service_category: string;
 *     city: string;
 *     service_title: string;
 *     bio: string;
 *     years_experience: number;
 *     starting_price_mad: number;
 *     full_address: string;
 *     is_active_provider: boolean;
 *   }
 * }
 */
export interface UpdateProviderProfileRequest {
  service_category?: string;
  city?: string;
  service_title?: string;
  bio?: string;
  years_experience?: number;
  starting_price_mad?: number;
  full_address?: string;
  is_active_provider?: boolean;
}

export interface UpdateProviderProfileResponse {
  status: string;
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
    service_category: {
      en: string;
      fr: string;
      ar: string;
    };
    city: {
      en: string;
      fr: string;
      ar: string;
    };
    service_title: string;
    bio: string;
    years_experience: number;
    starting_price_mad: number;
    full_address: string;
    is_active_provider: boolean;
  };
}

export const updateProviderProfile = async (
  data: UpdateProviderProfileRequest
): Promise<UpdateProviderProfileResponse> => {
  const response = await api.put<UpdateProviderProfileResponse>("/profile/update-provider", data);
  return response.data;
};

/**
 * Upload provider profile photo
 */
export const uploadProfilePhoto = async (photo: File) => {
  const formData = new FormData();
  formData.append("photo", photo);
  const response = await api.post<{
    status: string;
    message: string;
    photo_url?: string;
    profile_completion_updated?: boolean;
  }>("/profile/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  // Backend should return absolute URL, but ensure it's absolute as fallback
  if (response.data.photo_url) {
    response.data.photo_url = ensureAbsoluteUrl(response.data.photo_url) || response.data.photo_url;
  }
  
  return response.data;
};

/**
 * Upload portfolio image
 */
export const uploadPortfolioImage = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await api.post<{
    status: string;
    message: string;
    image_url?: string;
    image_id?: string;
  }>("/profile/upload-portfolio-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  // Backend should return absolute URL, but ensure it's absolute as fallback
  if (response.data.image_url) {
    response.data.image_url = ensureAbsoluteUrl(response.data.image_url) || response.data.image_url;
  }
  
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
  const response = await api.post<{
    status: string;
    message: string;
    photo_url?: string;
    service_photo?: {
      id: string;
      url: string;
    };
  }>("/profile/upload-service-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  // Backend should return absolute URLs, but ensure they're absolute as fallback
  if (response.data.photo_url) {
    response.data.photo_url = ensureAbsoluteUrl(response.data.photo_url) || response.data.photo_url;
  }
  
  // Also handle service_photo object if present
  if (response.data.service_photo?.url) {
    response.data.service_photo.url = ensureAbsoluteUrl(response.data.service_photo.url) || response.data.service_photo.url;
  }
  
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

