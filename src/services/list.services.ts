import api from "@/lib/apiClient";

export const getCategory = async () => {
  const response = await api.get("/category/list");
  // Backend returns array directly, axios wraps it in response.data
  return { data: response.data || [] };
};

export const getCity = async () => {
  const response = await api.get("/city/list");
  // Backend returns array directly, axios wraps it in response.data
  return { data: response.data || [] };
};
