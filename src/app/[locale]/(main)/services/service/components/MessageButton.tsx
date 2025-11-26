"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import MessageBlack from "@/assets/services/MessageBlack.svg";
import { useAuth } from "@/store/AuthContext";
import { createConversation } from "@/services/message.services";
import { logger } from "@/lib/logger";
import { secureStorage } from "@/lib/secureStorage";
import { useTranslations } from "next-intl";

interface MessageButtonProps {
  providerId: string;
  providerName: string;
  locale: string;
}

export default function MessageButton({ providerId, providerName, locale }: MessageButtonProps) {
  const router = useRouter();
  const { user, loading: authLoading, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("services.service.contact");

  const handleMessage = async () => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      toast.info("Please wait while we verify your login...");
      return;
    }

    // Check if user exists or if there's an access token (user might be loading)
    const accessToken = await secureStorage.get("accessToken");
    
    // If we have a token but user is not loaded, try to refresh the profile
    if (!user && accessToken) {
      logger.info("User not loaded but token exists, refreshing profile...");
      try {
        await refreshProfile();
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        logger.error("Failed to refresh profile:", error);
      }
    }
    
    // Final check - if no user and no token, redirect to login
    if (!user && !accessToken) {
      // Store the current page URL so we can return after login
      const returnUrl = window.location.pathname + window.location.search;
      router.push(`/${locale}/auth?mode=login&returnUrl=${encodeURIComponent(returnUrl)}`);
      toast.info("Please login to send a message");
      return;
    }

    // If still no user after refresh, redirect to login
    if (!user) {
      const returnUrl = window.location.pathname + window.location.search;
      router.push(`/${locale}/auth?mode=login&returnUrl=${encodeURIComponent(returnUrl)}`);
      toast.error("Failed to load user profile. Please try logging in again.");
      return;
    }

    // Check if user is a client (only clients can message providers)
    if (user.role !== "client") {
      toast.error("Only clients can message providers");
      return;
    }

    try {
      setLoading(true);
      // Create or get conversation
      const conversation = await createConversation({
        provider_id: providerId,
        client_id: user.id,
        subject: `Service inquiry for ${providerName}`,
      });
      
      logger.info("Conversation created:", conversation);
      
      // Navigate to the specific conversation
      if (conversation?.id) {
        router.push(`/${locale}/messages/${conversation.id}`);
        toast.success("Conversation started!");
      } else {
        // Fallback: navigate to messages page if conversation ID is missing
        router.push(`/${locale}/messages`);
        toast.success("Conversation started! Select it from the list.");
      }
    } catch (error: any) {
      logger.error("Error creating conversation:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to start conversation. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMessage}
      disabled={loading || authLoading}
      className="text-subtext font-roboto border-subtext focus:ring-subtext/80 disabled:bg-btnDisabled flex h-[clamp(40px,2vh,48px)] w-full cursor-pointer items-center justify-center gap-2 rounded-lg border text-[clamp(12px,1vw,16px)] font-normal duration-300 hover:-translate-y-px hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5] disabled:cursor-not-allowed"
      aria-label={`Send a message to ${providerName}`}
    >
      <MessageBlack
        className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
        role="img"
        aria-hidden="true"
      />
      {loading || authLoading ? "Loading..." : t("message")}
    </button>
  );
}

