"use client";
import { useEffect, useState } from "react";

import { logger } from "@/lib/logger";
import { getCategory } from "@/services/list.services";
import { toast } from "sonner";

export interface Category {
  id: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
}

export default function useCatagory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCategory();
        setCategories(response.data || []); // store the whole object
      } catch (error) {
        const errorMessage = "Failed to load service categories";
        logger.error("Error fetching categories:", error);
        setError(errorMessage);
        // Don't show toast on initial load to avoid spam
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
}
