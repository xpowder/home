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
          } catch (error) {
            // If it's a client (not a provider), we can't fetch provider details
            // In that case, we'll show basic info from conversation
            logger.warning("Could not fetch provider details, may be a client:", error);
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
      <div className="flex h-full items-center justify-center bg-white p-4">
        <div className="text-subtext">Loading profile...</div>
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
      <div className="flex h-full items-center justify-center bg-white p-4">
        <div className="text-subtext text-center">User information not available</div>
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
    <div className="flex h-full flex-col overflow-y-auto bg-white p-6">
      {/* Profile Header */}
      <div className="mb-6 text-center">
        <div className="relative mx-auto mb-4 h-24 w-24">
          <Image
            src={profileImage}
            alt={fullName}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-roboto text-heading text-lg font-semibold">{fullName}</h3>
          {provider.is_active_provider && (
            <Check className="text-primary h-5 w-5" />
          )}
        </div>
        <p className="text-subtext mt-1 text-sm">{serviceCategory}</p>
        <p className="text-subtext mt-1 text-sm">{city}</p>
      </div>

      {/* Contact Buttons */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="bg-primaryLight hover:bg-primaryLight/80 flex flex-col items-center justify-center gap-2 rounded-lg p-3 transition-colors"
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
            className="bg-green-50 hover:bg-green-100 flex flex-col items-center justify-center gap-2 rounded-lg p-3 transition-colors"
            aria-label="WhatsApp provider"
          >
            <WhatsappWhite className="h-5 w-5 text-green-600" />
            <span className="text-xs font-medium text-green-600">WhatsApp</span>
          </a>
        )}

        <Link
          href={`/${locale}/services/${provider.id}`}
          className="bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center gap-2 rounded-lg p-3 transition-colors"
          aria-label="View profile"
        >
          <Profile className="h-5 w-5 text-gray-600" />
          <span className="text-xs font-medium text-gray-600">Profile</span>
        </Link>
      </div>

      {/* Rating */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <Star className="text-supporting fill-supporting h-5 w-5" />
        <span className="font-roboto text-heading text-base font-semibold">
          {rating.toFixed(1)} ({reviewCount} reviews)
        </span>
      </div>

      {/* About Section */}
      <div className="mb-6">
        <h4 className="font-roboto text-heading mb-2 text-sm font-semibold">About</h4>
        <p className="text-subtext text-sm leading-relaxed">{bio}</p>
      </div>

      {/* Top Services Section */}
      {provider.service_title && (
        <div>
          <h4 className="font-roboto text-heading mb-3 text-sm font-semibold">Top Services</h4>
          <div className="space-y-3">
            <div className="border-subtextSection rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="bg-primaryLight flex h-8 w-8 items-center justify-center rounded-lg">
                  <span className="text-primary text-lg">⚡</span>
                </div>
                <div className="flex-1">
                  <p className="font-roboto text-heading text-sm font-medium">{provider.service_title}</p>
                  <p className="text-subtext text-xs">
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

