import "@/styles/globals.css";

import { ReactNode } from "react";

import { inter, outfit, poppins, roboto } from "@/utils/fonts";

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${roboto.variable} ${outfit.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
