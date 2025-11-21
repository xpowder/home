import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Locales you actually support
  locales: ["en", "fr", "ar"],
  defaultLocale: "en",

  // Translations for each pathname per locale
  pathnames: {
    "/": "/", // same for all locales

    // Example of a page that has different slugs
    "/pathnames": {
      en: "/pathnames", // English
      fr: "/noms-de-chemin", // French
      ar: "/مسارات", // Arabic
    },
  },
});
