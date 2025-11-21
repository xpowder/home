// lib/apiClient.ts
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { env } from "@/lib/env";

import { logger } from "./logger";
import { secureStorage } from "./secureStorage";

const isBrowser = typeof window !== "undefined";

const api = axios.create({
  baseURL:
    env.NEXT_PUBLIC_TEST_BACKEND_LOCALLY === "true"
      ? "http://localhost:8000/api"
      : env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

// ---- Token Refresh Management ----
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const failedQueue: Array<{
  resolve: (value: AxiosResponse) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

// ---- Request Interceptor ----
api.interceptors.request.use(
  async (config) => {
    if (isBrowser) {
      const token = await secureStorage.get("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Centralized Error Handler ----
function handleError(error: unknown) {
  let message = "An unexpected error occurred";

  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.statusText) {
      message = error.response.statusText;
    } else if (!error.response) {
      message = "Network error. Please check your connection.";
    }
  }

  // Log to console
  logger.error("[API Error]", error);

  // Show toast
  if (isBrowser) toast.error(message);

  return message;
}

// ---- Response Interceptor ----
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401 && !originalRequest._retry;

    if (isUnauthorized) {
      originalRequest._retry = true;

      if (!isBrowser) return Promise.reject(error);

      const refreshToken = await secureStorage.get("refreshToken");
      if (!refreshToken) {
        clearTokens();
        redirectToLogin();
        return Promise.reject(error);
      }

      // ---- Queue requests during refresh ----
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      refreshPromise = api
        .post(`/auth/refresh-token?refresh_token=${refreshToken}`)
        .then(async ({ data }) => {
          await secureStorage.set("accessToken", data.access_token);
          await secureStorage.set("refreshToken", data.refresh_token);
          return data.access_token;
        })
        .catch((refreshError) => {
          clearTokens();
          redirectToLogin();
          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });

      try {
        const newAccessToken = await refreshPromise;

        // Retry queued requests
        await Promise.all(
          failedQueue.map(({ resolve, reject, config }) => api(config).then(resolve).catch(reject))
        );
        failedQueue.length = 0;

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        handleError(err); // <-- call here for refresh failure
        return Promise.reject(err);
      }
    }

    // ---- All other errors ----
    handleError(error); // <-- call here for non-401 errors
    return Promise.reject(error);
  }
);

// ---- Helper Functions ----
async function clearTokens() {
  if (!isBrowser) return;
  await secureStorage.remove("accessToken");
  await secureStorage.remove("refreshToken");
}

function redirectToLogin() {
  if (!isBrowser) return;
  window.location.href = "/auth"; // Cannot use useRouter() here
}

export default api;
