import api from "@/lib/apiClient";

export const getCategory = async () => {
  const response = await api.get("/category/list");
  return response;
};

export const getCity = async () => {
  const response = await api.get("/city/list");
  return response;
};
