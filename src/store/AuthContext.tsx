"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { logger } from "@/lib/logger";
import { secureStorage } from "@/lib/secureStorage";
import { fetchProfile, logoutUser } from "@/services/auth.services";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  email_verified?: boolean;
  verification_status?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  USER: "user",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

const CACHE_TTL = 15 * 60 * 1000; // 5 minutes

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isFetchingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    (async function hydrateAndRevalidate() {
      try {
        const cached = await secureStorage.get(STORAGE_KEYS.USER);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as User & { cachedAt?: number };
            if (parsed.cachedAt && Date.now() - parsed.cachedAt < CACHE_TTL) {
              if (mountedRef.current) setUser(parsed);
              if (mountedRef.current) setLoading(false);
            }
          } catch {
            logger.warn("Failed to parse cached user, refetching");
          }
        }

        await fetchAndCacheProfile({ silent: true });
      } catch (err) {
        logger.error("hydrateAndRevalidate error", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    // Listen for storage changes (when tokens are set after login)
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ACCESS_TOKEN && e.newValue) {
        // Token was added/updated, refresh profile
        logger.info("Access token detected, refreshing profile...");
        await fetchAndCacheProfile({ silent: true });
      } else if (e.key === STORAGE_KEYS.ACCESS_TOKEN && !e.newValue) {
        // Token was removed, clear user
        if (mountedRef.current) setUser(null);
      }
    };

    // Listen for custom event when tokens are set (for same-tab login)
    const handleTokenSet = async () => {
      logger.info("Token set event detected, refreshing profile...");
      await fetchAndCacheProfile({ silent: true });
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth:tokenSet", handleTokenSet);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth:tokenSet", handleTokenSet);
    };
  }, []);

  const fetchAndCacheProfile = async ({ silent = false }: { silent?: boolean } = {}) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const accessToken = await secureStorage.get(STORAGE_KEYS.ACCESS_TOKEN);
      if (!accessToken) {
        if (mountedRef.current) setUser(null);
        await secureStorage.remove(STORAGE_KEYS.USER);
        return;
      }

      const res = await fetchProfile();
      const profile = res?.data?.user as User | undefined;

      if (!profile) {
        if (!silent) toast.error("Failed to fetch profile");
        if (mountedRef.current) setUser(null);
        await secureStorage.remove(STORAGE_KEYS.USER);
        return;
      }

      const userWithCache = { ...profile, cachedAt: Date.now() };
      if (mountedRef.current) setUser(userWithCache);
      await secureStorage.set(STORAGE_KEYS.USER, JSON.stringify(userWithCache));
    } catch (err: any) {
      logger.error("fetchAndCacheProfile error", err);
      if (!silent) toast.error("Could not refresh profile.");
      if (err?.response?.status === 401) {
        await clearSession();
        if (mountedRef.current) router.push("/auth");
      }
    } finally {
      isFetchingRef.current = false;
    }
  };

  const refreshProfile = async () => {
    await fetchAndCacheProfile({ silent: false });
  };

  const logout = async () => {
    try {
      const refreshToken = await secureStorage.get(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) await logoutUser(refreshToken);
    } catch (err) {
      logger.warn("Server logout failed, continuing local cleanup", err);
    } finally {
      await clearSession();
      router.push("/logged-out");
    }
  };

  const clearSession = async () => {
    await secureStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    await secureStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    await secureStorage.remove(STORAGE_KEYS.USER);
    if (mountedRef.current) setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
