"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import Bell from "@/assets/header/Bell.svg";
import DropDownIcon from "@/assets/header/DropDownIcon.svg";
import Edit from "@/assets/header/Edit.svg";
import Help from "@/assets/header/Help.svg";
import LogOut from "@/assets/header/LogOut.svg";
import Message from "@/assets/header/Message.svg";
import Profile from "@/assets/header/Profile.svg";
import Services from "@/assets/header/Service.svg";
import Settings from "@/assets/header/Settings.svg";
import ProfileImage from "@/assets/providerDashboard/i1.png";
import { logger } from "@/lib/logger";
import { secureStorage } from "@/lib/secureStorage";
import { useAuth } from "@/store/AuthContext";

const DropDownMenu = [
  { label: "myProfile", icon: Profile, href: "/profile" },
  { label: "editProfile", icon: Edit, href: "/editProfile" },
  { label: "services", icon: Services, href: "/services" },
  { label: "account", icon: Settings, href: "/settings" },
  { label: "help", icon: Help, href: "/help" },
  { label: "logout", icon: LogOut, href: "/log-out" },
];

const userData = {
  profileImage: ProfileImage,
  name: "Youssef Plumbing",
  status: true,
};

export default function ActionButtons() {
  const t = useTranslations("header");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  async function isToken() {
    const token = await secureStorage.get("accessToken");
    await secureStorage.showAllTokens();
    logger.info("token", token);
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
    <div className="relative flex w-full flex-col items-center justify-center gap-4 p-5 md:flex-row md:gap-6 xl:p-0">
      {isLoggedIn ? (
        <div className="flex items-center justify-center gap-6">
          <button type="button" aria-label="Notifications">
            <Bell className="h-6 w-6 cursor-pointer md:h-5 md:w-5" />
          </button>
          <button type="button" aria-label="Messages">
            <Message className="h-6 w-6 cursor-pointer md:h-5 md:w-5" />
          </button>

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
              <div className="bg-secondary font-poppins text-6 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                {user?.first_name[0]}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-inter text-heading text-[16px] font-semibold">
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
                    : ""}
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className={`h-2 w-2 rounded-full ${userData.status ? "bg-[#16A34A]" : "bg-red-500"}`}
                  />
                  <span className="font-inter text-[14px] ">
                    {userData.status ? (
                      <span className="text-[#16A34A]">{t("active")}</span>
                    ) : (
                      <span className="text-red-500">{t("inactive")}</span>
                    )}
                  </span>
                </div>
              </div>
              <DropDownIcon className="ml-2 mt-1 h-4 w-4" />
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 z-50 mt-3 w-[200px] rounded-md bg-white shadow-lg dark:bg-white/10">
                <ul className="flex flex-col py-2">
                  {DropDownMenu.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="dark:hover:bg-secondary/50 flex items-center gap-3 px-6 py-2 text-[15px] text-gray-600 hover:bg-gray-100 dark:text-gray-100"
                      >
                        <item.icon className="h-4 w-4" />
                        {t(`${item.label}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href="/auth"
            aria-label={t("login")}
            className="font-inter text-heading border-foreground/20 hover:text-primary flex h-9 items-center justify-center rounded-md border px-4 text-[clamp(15px,16px,17px)] duration-300"
          >
            {t("login")}
          </Link>
          <Link
            href="/auth?mode=sign up&role=provider"
            aria-label={t("join")}
            className="bg-primary border-background hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-9 cursor-pointer items-center justify-center rounded-sm border px-4 text-white duration-300 hover:-translate-y-px hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
          >
            {t("join")}
          </Link>
        </div>
      )}
    </div>
  );
}
