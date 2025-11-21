"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import MessageBlack from "@/assets/services/MessageBlack.svg";
import { useAuth } from "@/store/AuthContext";
import { createConversation } from "@/services/message.services";
import { logger } from "@/lib/logger";
import { useTranslations } from "next-intl";

interface MessageButtonProps {
  providerId: string;
  providerName: string;
  locale: string;
}

export default function MessageButton({ providerId, providerName, locale }: MessageButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("services.service.contact");

  const handleMessage = async () => {
    if (!user) {
      router.push(`/${locale}/auth/login`);
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
      
      // Navigate to messages page with the conversation
      router.push(`/${locale}/messages`);
    } catch (error) {
      logger.error("Error creating conversation:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMessage}
      disabled={loading}
      className="text-subtext font-roboto border-subtext focus:ring-subtext/80 disabled:bg-btnDisabled flex h-[clamp(40px,2vh,48px)] w-full cursor-pointer items-center justify-center gap-2 rounded-lg border text-[clamp(12px,1vw,16px)] font-normal duration-300 hover:-translate-y-px hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5] disabled:cursor-not-allowed"
      aria-label={`Send a message to ${providerName}`}
    >
      <MessageBlack
        className="h-[clamp(10px,1vw,16px)] min-h-2.5 w-[clamp(10px,1vw,16px)] min-w-2.5"
        role="img"
        aria-hidden="true"
      />
      {loading ? "Loading..." : t("message")}
    </button>
  );
}

