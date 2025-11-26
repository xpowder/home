"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import PostCard2 from "../homeComponents/postCard/PostCard2";
import FeaturesCommingSoon from "./components/featuresCommingSoon";
import MyPerformance from "./components/myPerformance";
import MyServices from "./components/myServices";
import PortfolioAndCredentials from "./components/portfolioAndCredentials";
import Profile from "./components/profile";
import { useAuth } from "@/store/AuthContext";
import { logger } from "@/lib/logger";

export default function Page() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  useEffect(() => {
    // Wait for auth to load before checking role
    if (loading) return;

    // If user is not a provider, redirect them away
    if (user && user.role !== "provider") {
      logger.warn(`User with role "${user.role}" attempted to access providers dashboard`);
      toast.error("Access denied. This page is only available for service providers.");
      router.push(`/${locale}`);
    }
  }, [user, loading, locale, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-subtext text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not a provider, don't render the dashboard
  if (user && user.role !== "provider") {
    return null;
  }

  // If no user, don't render (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div>
      <Profile />
      <MyPerformance />
      <MyServices />
      <PortfolioAndCredentials />
      <FeaturesCommingSoon />
      <PostCard2 />
    </div>
  );
}
