"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

import Headphones from "@/assets/home/faq/Headphone.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useComingSoonAlert from "@/hooks/useCommingSoonAlert";
import { FAQListKeys } from "@/utils/constants/homeData";
import { sectionHeading, sectionParagraph } from "@/utils/fonts";

export default function Faq() {
  const [toggle, setToggle] = useState<"user" | "provider">("user");
  const showCommingSoon = useComingSoonAlert();
  const t = useTranslations("faq");

  return (
    <section
      className="container px-5 py-16 md:px-20"
      aria-labelledby={t("section.headingAriaLabel")}
    >
      <div
        className="border-primary mx-auto my-0 flex h-full w-[90%] items-center justify-center rounded-2xl  border-0 md:border md:px-[10%] md:py-14"
        aria-label={t("section.containerAriaLabel")}
      >
        <div className="h-full w-full">
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="flex flex-col items-center justify-center gap-2 px-4  pb-4 sm:px-0"
              aria-label="Section header"
            >
              <h2
                className={`${sectionHeading} text-heading text-center`}
                aria-label={t("section.headerAriaLabel")}
              >
                {t("section.heading")}
              </h2>
              <p
                className={`${sectionParagraph} text-subtext text-center`}
                aria-label={t("section.descriptionAriaLabel")}
              >
                {t("section.description")}
              </p>
            </div>
            {/* Toggle Buttons */}
            <div
              className="bg-background border-background shadow-foreground/10 mb-8 flex h-16 w-[clamp(120px,60vw,327px)] items-center justify-between rounded-full border px-2 shadow-xl"
              role="group"
              aria-label={t("toggle.groupAriaLabel")}
            >
              <button
                onClick={() => setToggle("user")}
                aria-label={t("toggle.user.ariaLabel")}
                className={`${
                  toggle === "user" ? "bg-primary text-white" : "bg-background text-subtext"
                } h-12 w-full cursor-pointer rounded-full text-[clamp(12px,20%,24px)] outline-none transition-colors duration-500`}
              >
                {t("toggle.user.label")}
              </button>
              <button
                onClick={() => setToggle("provider")}
                aria-label={t("toggle.provider.ariaLabel")}
                className={`${
                  toggle === "provider" ? "bg-primary text-white" : "bg-background text-subtext"
                } h-12 w-full cursor-pointer rounded-full text-[clamp(12px,20%,24px)] outline-none transition-colors duration-500`}
              >
                {t("toggle.provider.label")}
              </button>
            </div>
          </div>

          {/* FAQ Accordions */}
          <div>
            {(toggle === "user" ? FAQListKeys["user"] : FAQListKeys["provider"]).map(
              (faq, index) => (
                <Accordion
                  type="single"
                  collapsible
                  className="mt-4 w-full"
                  key={index}
                  aria-label={`${t("accordion.itemAriaLabel")} ${index + 1}`}
                >
                  <AccordionItem value={`item-${index}`} className="border-background border-b">
                    <AccordionTrigger
                      className={`font-poppins text-foreground bg-background  border-primary h-16 w-full rounded-xl border border-r-[6px] p-2.5 text-[clamp(12px,50%,16px)] font-semibold outline-none`}
                      aria-label={`${t("accordion.questionAriaLabel")}`}
                    >
                      {t(`${faq}.question`)}
                    </AccordionTrigger>
                    <AccordionContent aria-label={t("accordion.answerAriaLabel")}>
                      <p
                        className={`font-roboto mb-6 mt-2  text-[16px] font-normal text-[#4B4B4B]`}
                      >
                        {t(`${faq}.answer`)}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            )}
          </div>

          {/* Contact Support Box */}
          <div className="mt-8 flex items-center justify-center">
            <button
              aria-label={t("contactSupport.ariaLabel")}
              type="button"
              onClick={showCommingSoon}
              className="bg-primary hover:bg-btnHover active:bg-btnPressed focus:bg-btn focus:ring-btn disabled:bg-btnDisabled flex h-12 w-[max(18%,210px)] cursor-pointer items-center justify-center  gap-2 rounded-full text-white shadow-md shadow-black/10 duration-300 hover:-translate-y-px hover:shadow-xl active:shadow-sm disabled:text-[#E5E5E5]"
            >
              <Headphones className="h-4 w-4" aria-hidden="true" />
              <span className={`font-poppins text-[80%] font-semibold leading-[100%]`}>
                {t("contactSupport.label")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
