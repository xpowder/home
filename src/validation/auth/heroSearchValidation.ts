import { z } from "zod";

export const HeroSearchSchema = z.object({
  categoryId: z.string().nonempty("Category is required"),
  cityId: z.string().nonempty("City is required"),
});
