"use client";
import { useEffect, useState } from "react";

import { logger } from "@/lib/logger";
import { getCity } from "@/services/list.services";
import { toast } from "sonner";

export interface City {
  id: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
  code: string;
  is_major: boolean;
}

export default function useCity() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCity();
        setCities(response.data || []); // store full objects
      } catch (error) {
        const errorMessage = "Failed to load cities";
        logger.error("Error fetching cities:", error);
        setError(errorMessage);
        // Don't show toast on initial load to avoid spam
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  return { cities, loading, error };
}
