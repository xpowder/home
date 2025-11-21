"use client";
import { useEffect, useState } from "react";

import { logger } from "@/lib/logger";
import { getCategory } from "@/services/list.services";

export interface Category {
  id: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
}

export default function useCatagory() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategory();
        setCategories(response.data); // store the whole object
      } catch (error) {
        logger.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return categories;
}
