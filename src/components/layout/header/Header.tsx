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
    <header className="bg-background sticky top-0 z-50 shadow-sm">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="relative h-[8vh] max-h-[100px] min-h-[60px] w-full px-[2vw]"
      >
        <div className="container z-40 flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label={t("logoLabel")} className="flex items-center gap-1">
            <Logo
              role="img"
              aria-label={t("logoLabel")}
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <span className="font-poppins bg-primary bg-clip-text text-[min(24px,5vw)] font-bold leading-6 text-transparent">
              Homezup
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center xl:flex">
            <NavLinks />
          </div>
          <div className="hidden items-center xl:flex">
            <HeaderActions />
          </div>

          {/* Mobile toggle */}
          <div className="flex xl:hidden ">
            <ActionTogglers />
            <button
              aria-label={open ? t("closeMenu") : t("openMenu")}
              className="text-primary cursor-pointer"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          ref={dropdownRef}
          className={`bg-background absolute left-0 top-[clamp(60px,8vh,100px)] w-full shadow-md transition-all duration-1000 ease-in-out xl:hidden ${
            open
              ? "pointer-events-auto z-30 translate-y-0 opacity-100"
              : "-translate-y-100 pointer-events-none opacity-0"
          }`}
        >
          <NavLinks onClick={() => setOpen(false)} />
          {/* <hr className="my-4 text-foreground/20" /> */}
          <div className="flex flex-col items-center gap-4">
            <ActionButtons />
          </div>
        </div>
      </nav>
    </header>
  );
}
