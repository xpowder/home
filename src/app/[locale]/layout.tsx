//app/[locale]/layout
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server"; // ✅ getMessages is needed
import { Toaster } from "sonner";

import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/store/AuthContext";
import { LanguageProvider } from "@/store/LanguageContext";
import { ThemeProvider } from "@/store/ThemeProvider";
import GlobalErrorHandler from "@/components/shared/GlobalErrorHandler";

import NoInternet from "./no-internet";

export const metadata: Metadata = {
  title: "Homezup – Find trusted home services",
  description: "A Moroccan digital marketplace for home services.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  // if (!hasLocale(routing.locales, locale)) {
  //   return <NotFound />;
  // }

  // Enable static rendering
  setRequestLocale(locale);

  // ✅ Load translations for this locale
  const messages = await getMessages();
  //(await import(`../../../messages/${locale}.json`)).default previously tried and it works too

  // ✅ Detect text direction
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div lang={locale} dir={dir}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider attribute={"class"} defaultTheme="light" enableSystem>
          <LanguageProvider>
            <AuthProvider>
              <GlobalErrorHandler />
              <NoInternet />
              {children}
              <Toaster position="top-right" richColors duration={4000} />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  );
}
