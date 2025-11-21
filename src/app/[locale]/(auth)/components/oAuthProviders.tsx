"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    logger.error("Missing GOOGLE_CLIENT_ID");
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
