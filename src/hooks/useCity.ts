"use client";
import { useEffect, useState } from "react";

import { logger } from "@/lib/logger";
import { getCity } from "@/services/list.services";

export interface City {
  id: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
  code: string;
  is_major: boolean;
}

export default function useCities() {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCity();
        setCities(response.data); // store full objects
      } catch (error) {
        logger.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  return cities;
}
