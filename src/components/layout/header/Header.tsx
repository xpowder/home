"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import Logo from "@/assets/header/homezupLogo.svg";

import ActionButtons from "./actionButtons";
import ActionTogglers from "./actionTogglers";
import { HeaderActions } from "./headerActions";
import { NavLinks } from "./navlinks";

export default function Header() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-background sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-gray-800">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="relative h-[8vh] max-h-[100px] min-h-[60px] w-full px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto z-40 flex h-full items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link href="/" aria-label={t("logoLabel")} className="flex items-center gap-1.5 sm:gap-2">
            <Logo
              role="img"
              aria-label={t("logoLabel")}
              width={40}
              height={40}
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
            />
            <span className="font-poppins bg-primary bg-clip-text text-lg sm:text-xl md:text-2xl font-bold leading-tight text-transparent">
              Homezup
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 xl:flex">
            <NavLinks />
          </div>
          <div className="hidden items-center xl:flex">
            <HeaderActions />
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-3 xl:hidden">
            <ActionTogglers />
            <button
              type="button"
              aria-label={open ? t("closeMenu") : t("openMenu")}
              className="text-primary cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={24} className="sm:w-7 sm:h-7" /> : <Menu size={24} className="sm:w-7 sm:h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          ref={dropdownRef}
          className={`bg-background absolute left-0 top-full w-full shadow-lg border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out xl:hidden ${
            open
              ? "pointer-events-auto z-30 translate-y-0 opacity-100 visible"
              : "pointer-events-none -translate-y-4 opacity-0 invisible"
          }`}
        >
          <div className="container mx-auto max-w-7xl py-4">
            <NavLinks onClick={() => setOpen(false)} />
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            <div className="flex flex-col items-stretch gap-3 px-4">
              <ActionButtons />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
