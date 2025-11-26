"use client";
import { useTranslations } from "next-intl";
import React from "react";
import {
  FileText,
  Target,
  MessageCircle,
  Cookie,
  Lock,
  UserCog,
  Globe,
  RefreshCw,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacyPolicy");

  const sections = [
    {
      icon: FileText,
      titleKey: "sections.whatWeCollect.title",
      contentKey: "sections.whatWeCollect",
    },
    {
      icon: Target,
      titleKey: "sections.howWeUse.title",
      contentKey: "sections.howWeUse",
    },
    {
      icon: MessageCircle,
      titleKey: "sections.communication.title",
      contentKey: "sections.communication",
    },
    {
      icon: Cookie,
      titleKey: "sections.cookies.title",
      contentKey: "sections.cookies",
    },
    {
      icon: Lock,
      titleKey: "sections.dataSecurity.title",
      contentKey: "sections.dataSecurity",
    },
    {
      icon: UserCog,
      titleKey: "sections.yourRights.title",
      contentKey: "sections.yourRights",
    },
    {
      icon: Globe,
      titleKey: "sections.externalServices.title",
      contentKey: "sections.externalServices",
    },
    {
      icon: RefreshCw,
      titleKey: "sections.policyUpdates.title",
      contentKey: "sections.policyUpdates",
    },
    {
      icon: Mail,
      titleKey: "sections.contactUs.title",
      contentKey: "sections.contactUs",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <div className="inline-block bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg px-4 py-2">
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              {t("effectiveDate")}
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg flex-shrink-0">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {t(section.titleKey)}
                    </h2>

                    {/* What We Collect Section */}
                    {section.contentKey === "sections.whatWeCollect" && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
                            {t("sections.whatWeCollect.users.title")}
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300 ml-4">
                            {t.raw("sections.whatWeCollect.users.items").map(
                              (item: string, i: number) => (
                                <li key={i}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
                            {t("sections.whatWeCollect.providers.title")}
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300 ml-4">
                            {t.raw("sections.whatWeCollect.providers.items").map(
                              (item: string, i: number) => (
                                <li key={i}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mt-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                              {t("sections.whatWeCollect.warning")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* How We Use Section */}
                    {section.contentKey === "sections.howWeUse" && (
                      <div className="space-y-4">
                        <ul className="space-y-2">
                          {t.raw("sections.howWeUse.items").map(
                            (item: string, i: number) => (
                              <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mt-4">
                          <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-green-800 dark:text-green-200 text-sm">
                              {t("sections.howWeUse.assurance")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Communication Section */}
                    {section.contentKey === "sections.communication" && (
                      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <p>{t("sections.communication.description")}</p>
                        <p>{t("sections.communication.newsletter")}</p>
                        <p>{t("sections.communication.unsubscribe")}</p>
                      </div>
                    )}

                    {/* Cookies Section */}
                    {section.contentKey === "sections.cookies" && (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {t("sections.cookies.description")}
                        </p>
                        <Link
                          href="/cookies-policy"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                        >
                          {t("sections.cookies.linkText")}
                          <span>→</span>
                        </Link>
                      </div>
                    )}

                    {/* Data Security Section */}
                    {section.contentKey === "sections.dataSecurity" && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {t("sections.dataSecurity.description")}
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                          <p className="text-blue-800 dark:text-blue-200 text-sm">
                            {t("sections.dataSecurity.note")}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Your Rights Section */}
                    {section.contentKey === "sections.yourRights" && (
                      <div className="space-y-4">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4">
                          {t.raw("sections.yourRights.items").map(
                            (item: string, i: number) => (
                              <li key={i}>{item}</li>
                            )
                          )}
                        </ul>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {t("sections.yourRights.contact")}{" "}
                          <a
                            href="mailto:privacy@homezup.ma"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                          >
                            privacy@homezup.ma
                          </a>
                        </p>
                      </div>
                    )}

                    {/* External Services Section */}
                    {section.contentKey === "sections.externalServices" && (
                      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <p>{t("sections.externalServices.description")}</p>
                        <p>{t("sections.externalServices.clarification")}</p>
                      </div>
                    )}

                    {/* Policy Updates Section */}
                    {section.contentKey === "sections.policyUpdates" && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t("sections.policyUpdates.description")}
                      </p>
                    )}

                    {/* Contact Us Section */}
                    {section.contentKey === "sections.contactUs" && (
                      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <p>{t("sections.contactUs.description")}</p>
                        <p>
                          {t("sections.contactUs.email")}{" "}
                          <a
                            href="mailto:privacy@homezup.ma"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                          >
                            privacy@homezup.ma
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

