"use client";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

import ErrorPage from "@/components/shared/ErrorPage";
import { logger } from "@/lib/logger";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const t = useTranslations("status.errorPage");
  useEffect(() => {
    logger.error(error, "Global error in (status) segment");
    toast.error(t("toast"));
  }, [error, t]);

  return <ErrorPage onRetry={reset} />;
}
