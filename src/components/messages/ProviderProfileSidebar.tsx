"use client";
import { Check, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

import CallBlue from "@/assets/providerDashboard/CallBlue.svg";
import WhatsappWhite from "@/assets/services/WhatsappWhite.svg";
import Profile from "@/assets/providerDashboard/Profile.svg";
import Star from "@/assets/home/offers/Star.svg";
import { Conversation } from "@/services/message.services";
import { getProviderDetails, Provider } from "@/services/provider.services";
import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import { useAuth } from "@/store/AuthContext";

interface ProviderProfileSidebarProps {
  conversation: Conversation;
}

export default function ProviderProfileSidebar({ conversation }: ProviderProfileSidebarProps) {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const locale = params.locale as string;
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        // If current user is provider, show client profile, otherwise show provider profile
        const otherUserId = currentUser?.role === "provider" 
          ? conversation.client_id 
          : conversation.provider_id;
        
        if (otherUserId) {
          try {
            const response = await getProviderDetails(otherUserId);
            setProvider(response.provider);
          } catch (error: any) {
            // If it's a client (not a provider), we can't fetch provider details
            // Check if it's a 404 error (not a provider) vs other errors
            if (error?.response?.status === 404) {
              // Silently handle 404 - the other user is likely a client, not a provider
              logger.info("Other user is not a provider, showing basic info from conversation");
            } else {
              // Log other errors (network, 500, etc.)
              logger.warn("Could not fetch provider details:", error);
            }
          }
        }
      } catch (error) {
        logger.error("Error fetching provider details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [conversation, currentUser]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-gray-900 p-4">
        <div className="text-subtext dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  // If provider details not available (e.g., client user), show basic info from conversation
  const otherUserName = currentUser?.role === "provider" 
    ? conversation.client_name 
    : conversation.provider_name;
  const otherUserEmail = currentUser?.role === "provider"
    ? conversation.client_email
    : conversation.provider_email;

  if (!provider && !otherUserName) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-gray-900 p-4">
        <div className="text-subtext dark:text-gray-400 text-center">User information not available</div>
      </div>
    );
  }

  const profileImage = provider?.profile_picture || "/home/latestOffers/avatar1.png";
  const fullName = provider ? `${provider.first_name} ${provider.last_name}` : otherUserName || "User";
  const serviceCategory = provider?.service_category?.[locale as keyof typeof provider.service_category] || provider?.service_category?.en || "Service Provider";
  const city = provider?.city?.[locale as keyof typeof provider.city] || provider?.city?.en || "Location";
  const rating = provider?.rating || 0;
  const reviewCount = provider?.review_count || 0;
  const bio = provider?.bio || "No description available.";
  const phone = provider?.phone || "";

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-900 p-6">
      {/* Profile Header */}
      <div className="mb-6 text-center">
        <div className="relative mx-auto mb-4 h-24 w-24">
          <Image
            src={profileImage}
            alt={fullName}
            fill
            sizes="96px"
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-roboto text-heading dark:text-white text-lg font-semibold">{fullName}</h3>
          {provider?.is_active_provider && (
            <Check className="text-primary h-5 w-5" />
          )}
        </div>
        <p className="text-subtext dark:text-gray-400 mt-1 text-sm">{serviceCategory}</p>
        <p className="text-subtext dark:text-gray-400 mt-1 text-sm">{city}</p>
      </div>

      {/* Contact Buttons */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="bg-primaryLight dark:bg-primary/20 hover:bg-primaryLight/80 dark:hover:bg-primary/30 flex flex-col items-center justify-center gap-2 rounded-lg p-3 transition-colors"
            aria-label="Call provider"
          >
            <Phone className="text-primary h-5 w-5" />
            <span className="text-primary text-xs font-medium">Call</span>
          </a>
        )}
        
        {phone && (
          <a
            href={`https://wa.me/${phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 flex flex-col items-center justify-center gap-2 rounded-lg p-3 transition-colors"
            aria-label="WhatsApp provider"
          >
            <WhatsappWhite className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">WhatsApp</span>
          </a>
        )}

        {provider?.id && (
          <Link
            href={`/${locale}/services/${provider.id}`}
            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-col items-center justify-center gap-2 rounded-lg p-3 transition-colors"
            aria-label="View profile"
          >
            <Profile className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Profile</span>
          </Link>
        )}
        {!provider?.id && (
          <div className="bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-2 rounded-lg p-3 opacity-50 cursor-not-allowed">
            <Profile className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Profile</span>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <Star className="text-supporting fill-supporting h-5 w-5" />
        <span className="font-roboto text-heading dark:text-white text-base font-semibold">
          {rating.toFixed(1)} ({reviewCount} reviews)
        </span>
      </div>

      {/* About Section */}
      <div className="mb-6">
        <h4 className="font-roboto text-heading dark:text-white mb-2 text-sm font-semibold">About</h4>
        <p className="text-subtext dark:text-gray-400 text-sm leading-relaxed">{bio}</p>
      </div>

      {/* Top Services Section */}
      {provider?.service_title && (
        <div>
          <h4 className="font-roboto text-heading dark:text-white mb-3 text-sm font-semibold">Top Services</h4>
          <div className="space-y-3">
            <div className="border-subtextSection dark:border-gray-700 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="bg-primaryLight dark:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-lg">
                  <span className="text-primary text-lg">⚡</span>
                </div>
                <div className="flex-1">
                  <p className="font-roboto text-heading dark:text-white text-sm font-medium">{provider.service_title}</p>
                  <p className="text-subtext dark:text-gray-400 text-xs">
                    Starting from {provider.starting_price_mad || 0} MAD {city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

