"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import RotateCw from "@/assets/notFound/RotateCW.svg";
import { Button } from "@/components/ui/button";
import { sectionHeading, sectionParagraph } from "@/utils/fonts";

export default function NoInternet() {
  const router = useRouter();
  const [online, setOnline] = useState(true);
  const t = useTranslations("status.noInternet");

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null; // hide component when online

  // Retry button handler
  const handleRetry = () => {
    if (navigator.onLine) {
      router.refresh(); // Only refresh if online
    } else {
      // Optional: notify user they are still offline
      alert("Still offline! Please check your connection.");
    }
  };

  return (
    <section
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#F0FCFB] p-4"
    >
      <h2 className={`${sectionHeading} text-subtext text-center`} id="offline-heading">
        {t("title")}
      </h2>
      <p
        className={`${sectionParagraph} text-subtext text-center`}
        aria-describedby="offline-heading"
      >
        {t("description")}
      </p>
      <Button
        onClick={handleRetry}
        aria-label="Retry connection"
        className="font-poppins bg-primaryDark hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn mt-2 flex h-[40px] w-[clamp(300px,5vw,400px)] cursor-pointer items-center justify-center gap-2 rounded-lg text-[clamp(10px,1vw,12px)] font-semibold text-white duration-300 hover:translate-y-[-1px] hover:shadow-xl focus:ring-2 active:shadow-sm"
      >
        <RotateCw className="h-4 w-4" aria-hidden="true" focusable="false" />
        {t("tryAgain")}
      </Button>
    </section>
  );
}
