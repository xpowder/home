"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import Apple from "@/assets/home/postCard/apple.svg";
import Play from "@/assets/home/postCard/play.svg";
import useComingSoonAlert from "@/hooks/useCommingSoonAlert";

export default function PostCard() {
  const [email, setEmail] = useState("");
  const showCommingSoon = useComingSoonAlert();
  const t = useTranslations("postcard");

  const sendEmail = async () => {
    if (!email) {
      toast.error("Please enter a valid email");
      return;
    }
    // Simulate an API call to send the email(depends of backend mailer)
    toast.info("We Got Your Email, We will notify you once we launch");
    setEmail("");
  };

  return (
    <section className="w-full  py-16 lg:px-0" role="region" aria-label={t("postCardAriaLabel")}>
      <div className="bg-secondary flex-items-center container mx-auto h-full w-full justify-center rounded-xl py-10  shadow-lg shadow-black/10 lg:my-20 ">
        <div className="grid h-full w-full grid-cols-1 items-center lg:grid-cols-2">
          {/* Left column: text and actions */}
          <div
            className="flex w-full flex-col items-start justify-center space-y-1 px-4 text-center lg:justify-center lg:space-y-3 lg:px-10 lg:text-start"
            aria-label={t("downloadInfoAriaLabel")}
          >
            <div className="w-full space-y-2">
              <h2 className={`font-poppins text-heading text-[clamp(18px,2vw,32px)] font-semibold`}>
                {t("heading")}
              </h2>
              <p className={`font-roboto text-heading text-[clamp(12px,1vw,16px)]  font-normal `}>
                {t("description")}
              </p>
            </div>

            {/* App store buttons */}
            <div
              className="h-37 flex w-full flex-col items-center justify-center gap-5 rounded-md bg-white/10 lg:items-start lg:px-5"
              aria-label={t("mobileAppAriaLabel")}
            >
              <p className={`font-poppins text-heading text-[clamp(11px,1vw,16px)] font-medium`}>
                {t("message")}
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={showCommingSoon}
                  aria-label={t("appStoreAriaLabel")}
                  className="flex h-16 w-full cursor-pointer items-center  justify-center  gap-2 rounded-xl bg-[#071621] p-5 px-3 duration-300 hover:scale-105"
                >
                  <Apple className="h-[clamp(16px,1vw,24px)] min-h-4 w-[clamp(16px,1vw,24px)] min-w-4" />
                  <div className="flex flex-col text-start">
                    <span
                      className={`font-outfit inline-block whitespace-nowrap  text-[clamp(8px,0.8vw,10px)] font-normal text-white`}
                    >
                      {t("downloadOn")}
                    </span>
                    <span
                      className={`font-outfit whitespace-nowrap text-[clamp(10px,1vw,16px)] font-normal text-white`}
                    >
                      {t("appStore")}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={showCommingSoon}
                  aria-label={t("googlePlayAriaLabel")}
                  className="flex h-16 w-full cursor-pointer items-center  justify-center gap-2 rounded-xl bg-[#071621] p-5 px-3 duration-300 hover:scale-105"
                >
                  <Play className="h-[clamp(16px,1vw,24px)] min-h-4 w-[clamp(16px,1vw,24px)] min-w-4" />
                  <div className="flex flex-col text-start">
                    <span
                      className={`font-outfit inline-block whitespace-nowrap  text-[clamp(8px,0.8vw,10px)] font-normal text-white`}
                    >
                      {t("getIt")}
                    </span>
                    <span
                      className={`font-outfit whitespace-nowrap text-[clamp(10px,1vw,16px)]  font-normal text-white`}
                    >
                      {t("googlePlay")}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Email signup */}
            <div className="w-full space-y-2" aria-label={t("EmailSignupAriaLabel")}>
              <p
                className={`font-roboto text-heading space-y-[5px]  text-[clamp(14px,2vw,18px)] font-medium`}
              >
                {t("emailMessage")}
              </p>
              <div className="flex w-full ">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("inputPlaceholder")}
                  aria-label={t("inputAriaLabel")}
                  className="h-12 w-full rounded-l-md rounded-r-none border-none bg-white px-5 text-[clamp(12px,1vw,16px)] text-[#4B4B4B] outline-none rtl:rounded-l-none rtl:rounded-r-md"
                />
                <button
                  type="button"
                  onClick={() => sendEmail()}
                  aria-label={t("submitEmailAriaLabel")}
                  className={`font-poppins bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled h-12 w-[clamp(150px,3vw,220px)] cursor-pointer rounded-l-none rounded-r-md text-[clamp(11px,0.9vw,14px)] font-bold  leading-[100%] text-white shadow-md shadow-black/10 duration-300 hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5] rtl:rounded-l-md rtl:rounded-r-none`}
                >
                  {t("submitEmail")}
                </button>
              </div>
            </div>
          </div>

          {/* Right column: decorative image */}
          <div
            className="m-auto hidden h-80 w-80 items-center justify-center  overflow-visible rounded-md  lg:flex"
            aria-label={t("decorativeLabel")}
          >
            <div className="bg-secondary rounded-4xl relative flex h-80 w-80 overflow-visible shadow-lg shadow-black/30">
              <Image
                src="/home/postCard/postCard.png"
                alt="Preview of Homezup app postcard"
                width={320}
                height={381}
                className="absolute bottom-0 min-h-[381px] w-80 rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
