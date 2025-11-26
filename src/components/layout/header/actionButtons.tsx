"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { User, Settings, Bell, Shield, HelpCircle, LogOut as LogOutIcon } from "lucide-react";

import DropDownIcon from "@/assets/header/DropDownIcon.svg";
import Message from "@/assets/header/Message.svg";
import ProfileImage from "@/assets/providerDashboard/i1.png";
import { logger } from "@/lib/logger";
import { secureStorage } from "@/lib/secureStorage";
import { useAuth } from "@/store/AuthContext";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";

// Base dropdown menu items (shown to all users)
const baseDropDownMenu = [
  { label: "accountSettings", icon: Settings, href: "/settings", isLogout: false },
  { label: "notifications", icon: Bell, href: "/notifications", isLogout: false },
  { label: "security", icon: Shield, href: "/security", isLogout: false },
  { label: "helpCenter", icon: HelpCircle, href: "/help", isLogout: false },
  { label: "logout", icon: LogOutIcon, href: "/log-out", isLogout: true },
];

// Provider-specific menu items
const providerDropDownMenu = [
  { label: "editProfile", icon: User, href: "/providers-dashboard", isLogout: false },
];

const userData = {
  profileImage: ProfileImage,
  name: "Youssef Plumbing",
  status: true,
};

export default function ActionButtons() {
  const t = useTranslations("header");
  const params = useParams();
  const locale = params.locale as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { unreadCount } = useMessageNotifications();

  async function isToken() {
    const token = await secureStorage.get("accessToken");
    // Removed debug call - showAllTokens() is for development only
    setIsLoggedIn(!!token);
  }

  useEffect(() => {
    isToken();
    logger.info("user", user);
  }, [user]);

  useEffect(() => {}, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 md:gap-6 xl:p-0">
      {isLoggedIn ? (
        <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6">
          <button 
            type="button" 
            aria-label="Notifications" 
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
            {unreadCount > 0 && (
              <span className="bg-primary absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-gray-900">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <Link 
            href={`/${locale}/messages`}
            aria-label="Messages"
            className="relative flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Message className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer transition-colors hover:text-primary" />
            {unreadCount > 0 && (
              <span className="bg-primary absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-gray-900">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          {/* User Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex cursor-pointer items-center gap-2"
              tabIndex={0}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setIsDropdownOpen((p) => !p)
              }
            >
              {/* <Image
                src={userData.profileImage}
                alt="User Avatar"
                width={36}
                height={36}
                className="h-10 w-10 rounded-full"
              /> */}
              <div className="bg-secondary font-poppins text-primary flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full font-bold text-sm sm:text-base">
                {user?.first_name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="hidden flex-col items-start sm:flex">
                <span className="font-inter text-heading text-sm sm:text-base font-semibold">
                  {user?.first_name
                    ? (() => {
                        const parts = user.first_name.trim().split(/\s+/);
                        const firstWord = parts[0];
                        let secondInitial = "";
                        if (parts.length > 1) {
                          secondInitial = parts[1][0] + ".";
                        } else if (user?.last_name) {
                          secondInitial = user.last_name[0] + ".";
                        }
                        return `${firstWord} ${secondInitial}`;
                      })()
                    : "User"}
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${userData.status ? "bg-[#16A34A]" : "bg-red-500"}`}
                  />
                  <span className="font-inter text-xs sm:text-sm">
                    {userData.status ? (
                      <span className="text-[#16A34A]">{t("active")}</span>
                    ) : (
                      <span className="text-red-500">{t("inactive")}</span>
                    )}
                  </span>
                </div>
              </div>
              <DropDownIcon className="hidden ml-1 h-4 w-4 sm:block" />
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 z-50 mt-3 w-[240px] rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800">
                <ul className="flex flex-col py-1">
                  {(() => {
                    // Build menu based on user role
                    const isProvider = user?.role === "provider";
                    const menuItems = isProvider 
                      ? [...providerDropDownMenu, ...baseDropDownMenu]
                      : baseDropDownMenu;
                    
                    return menuItems.map((item, index) => {
                      const href = item.href.startsWith("/") 
                        ? `/${locale}${item.href}` 
                        : `/${locale}/${item.href}`;
                      
                      // Add divider after Edit Profile if provider (index 0), after Security, and after Help Center
                      const showDividerAfter = (isProvider && index === 0) || 
                                              (index === (isProvider ? 3 : 2)) || 
                                              (index === (isProvider ? 4 : 3));
                      
                      return (
                        <React.Fragment key={index}>
                          <li>
                            <Link
                              href={href}
                              onClick={() => setIsDropdownOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 text-[15px] transition-colors ${
                                item.isLogout
                                  ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              <item.icon 
                                className={`h-5 w-5 flex-shrink-0 ${
                                  item.isLogout ? "text-red-500" : "text-gray-600 dark:text-gray-400"
                                }`} 
                              />
                              <span className={item.isLogout ? "text-red-500 font-medium" : "text-gray-800 dark:text-gray-200"}>
                                {t(`${item.label}`)}
                              </span>
                            </Link>
                          </li>
                          {showDividerAfter && (
                            <li className="border-t border-gray-200 dark:border-gray-700 mx-2" />
                          )}
                        </React.Fragment>
                      );
                    });
                  })()}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <Link
            href="/auth"
            aria-label={t("login")}
            className="font-inter text-heading border-foreground/20 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 flex h-9 sm:h-10 items-center justify-center rounded-lg border px-3 sm:px-4 text-sm sm:text-base font-medium duration-300 transition-colors"
          >
            {t("login")}
          </Link>
          <Link
            href="/auth?mode=sign up&role=provider"
            aria-label={t("join")}
            className="bg-primary border-background hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-9 sm:h-10 cursor-pointer items-center justify-center rounded-lg border px-3 sm:px-4 text-sm sm:text-base font-medium text-white duration-300 hover:shadow-md active:shadow-sm disabled:text-[#E5E5E5] transition-all"
          >
            {t("join")}
          </Link>
        </div>
      )}
    </div>
  );
}
