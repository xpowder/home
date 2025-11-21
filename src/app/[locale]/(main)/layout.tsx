import type { Metadata } from "next";
import { ReactNode } from "react";

import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
