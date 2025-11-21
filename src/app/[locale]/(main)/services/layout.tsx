import { Metadata } from "next";
import React, { ReactNode } from "react";

// Static meta information
export const metadata: Metadata = {
  title: "Homezup - Trusted Local Services",
  description: "Connecting you with trusted local service providers for all your home needs.",
  keywords: ["home services", "local services", "trusted providers", "Homezup"],
  authors: [{ name: "Homezup" }],
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
