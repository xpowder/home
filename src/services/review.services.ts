import api from "@/lib/apiClient";

export interface Review {
  id: string;
  provider_id: string;
  client_id: string;
  client_name?: string;
  rating: number;
  title?: string;
  comment?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  page_size: number;
}

export interface ProviderSummary {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewData {
  rating: number;
  title?: string;
  comment?: string;
}

/**
 * Get reviews for a provider
 */
export const getProviderReviews = async (
  providerId: string,
  page: number = 1,
  pageSize: number = 50
) => {
  const response = await api.get<ReviewListResponse>(
    `/reviews/providers/${providerId}?page=${page}&page_size=${pageSize}`
  );
  return response.data;
};

/**
 * Get provider rating summary
 */
export const getProviderSummary = async (providerId: string) => {
  const response = await api.get<{ average_rating: number; total_reviews: number; rating_distribution: Record<string, number> }>(
    `/reviews/providers/${providerId}/summary`
  );
  return response.data;
};

/**
 * Create a review for a provider
 */
export const createReview = async (providerId: string, data: CreateReviewData) => {
  const response = await api.post<Review>(`/reviews/providers/${providerId}`, data);
  return response.data;
};

/**
 * Update a review
 */
export const updateReview = async (reviewId: string, data: Partial<CreateReviewData>) => {
  const response = await api.patch<Review>(`/reviews/${reviewId}`, data);
  return response.data;
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

/**
 * Get a single review
 */
export const getReview = async (reviewId: string) => {
  const response = await api.get<Review>(`/reviews/${reviewId}`);
  return response.data;
};

