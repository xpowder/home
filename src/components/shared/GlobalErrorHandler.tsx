"use client";
import { useEffect } from "react";
import { logger } from "@/lib/logger";

/**
 * Global error handler for unhandled promise rejections and errors
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent default browser error logging
      event.preventDefault();
      
      const error = event.reason;
      
      // Log the error properly
      if (error instanceof Error) {
        logger.error(error, "Unhandled promise rejection");
      } else if (error instanceof Event) {
        // Handle Event objects that might be thrown
        logger.error(new Error(`Event error: ${error.type}`), "Unhandled promise rejection (Event)");
      } else {
        // Handle other types of errors
        logger.error(new Error(String(error)), "Unhandled promise rejection (unknown type)");
      }
    };

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      logger.error(event.error || new Error(event.message), "Global error");
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}

