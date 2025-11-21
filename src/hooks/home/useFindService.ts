"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { HeroSearchType } from "@/types/home/heroSearchType";
import { HeroSearchSchema } from "@/validation/auth/heroSearchValidation";

export default function useFindService() {
  const router = useRouter();
  const [search, setSearch] = useState<HeroSearchType>({
    categoryId: "",
    cityId: "",
  });

  const [loading, setLoading] = useState(false);

  const validateSearch = (): boolean => {
    const parsed = HeroSearchSchema.safeParse(search);
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => toast.error(i.message));
      return false;
    }
    return true;
  };

  const fetchData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateSearch()) return;

    try {
      setLoading(true);
      
      // Build query params for navigation
      const params = new URLSearchParams();
      if (search.categoryId) params.append("category", search.categoryId);
      if (search.cityId) params.append("city", search.cityId);

      // Navigate to services page with filters
      router.push(`/services?${params.toString()}`);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return {
    search,
    setSearch,
    loading,
    fetchData,
  };
}
