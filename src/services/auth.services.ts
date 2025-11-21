import { GoogleAuthResponse } from "@/app/[locale]/(auth)/components/GoogleOAuthButton";
import { LogoutSuccessResponse } from "@/app/[locale]/(auth)/components/logOut";
import { SuccessResponse } from "@/app/[locale]/(auth)/email-verification/page";
import { LoginSuccessResponse } from "@/app/[locale]/(auth)/hooks/useLoginForm";
import { SignUpSuccessResponse } from "@/app/[locale]/(auth)/hooks/useSignUpForm";
import { ResetPasswordSuccessResponse } from "@/app/[locale]/(auth)/reset-password/page";
import api from "@/lib/apiClient";
import { LoginSchema } from "@/validation/auth/loginSchema";
import { ProviderProfileForm } from "@/validation/auth/providerProfileSchema";
import { ResetPasswordSchema } from "@/validation/auth/resetPasswordSchema";
import { SignUpSchema } from "@/validation/auth/signUpSchema";

export const registerUser = async (payload: SignUpSchema & { role: "client" | "provider" }) => {
  const response = await api.post<SignUpSuccessResponse>("/auth/register", payload);
  return response.data;
};

export const loginWithGoogle = async ({ token, role }: { token: string; role: string }) => {
  const response = await api.post<GoogleAuthResponse>("/auth/google-login", {
    token,
    role,
  });
  console.log("oauth response", response);
  return response;
};

// API call for login
export const loginUser = async (payload: LoginSchema) => {
  const response = await api.post<LoginSuccessResponse>("/auth/login", payload);
  return response;
};

export const logoutUser = async (refreshToken: string | null) => {
  await api.post<LogoutSuccessResponse>("/auth/logout", { refresh_token: refreshToken });
};

export const completeProviderProfile = async (data: ProviderProfileForm) => {
  const formData = new FormData();

  formData.append("service_category", data.service_category);
  formData.append("service_title", data.service_title);
  formData.append("years_experience", data.years_experience.toString());
  formData.append("city", data.city);
  formData.append("full_address", data.full_address);
  formData.append("starting_price_mad", data.starting_price_mad.toString());
  formData.append("bio", data.bio);

  if (data.profile_photo) {
    formData.append("profile_photo", data.profile_photo);
  }

  data.portfolio_images?.forEach((file) => {
    if (file) formData.append("portfolio_images", file);
  });

  const { data: response } = await api.post("/profile/complete-provider", formData);
  return response;
};

export const requestPasswordReset = async (payload: ResetPasswordSchema) => {
  const response = await api.post<ResetPasswordSuccessResponse>(
    "/auth/request-password-reset",
    payload
  );
  return response;
};

export const resendVerification = async (email: string) => {
  const response = await api.post<SuccessResponse>(
    `/auth/resend-verification?email=${encodeURIComponent(email)}`
  );
  return response;
};

export const fetchProfile = async () => {
  const response = await api.get("/auth/profile");
  return response;
};

/**
 * Update user profile (first_name, last_name, phone)
 */
export const updateUserProfile = async (data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}) => {
  const response = await api.put("/auth/profile-update", data);
  return response.data;
};

/**
 * Delete user account
 */
export const deleteAccount = async () => {
  const response = await api.delete("/auth/delete-account");
  return response.data;
};
