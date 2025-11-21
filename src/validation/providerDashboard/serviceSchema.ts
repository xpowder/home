import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(3, "Service title must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  city: z.string().min(1, "Please select a city"),
  description: z.string().min(10, "Description should be at least 10 characters long"),
  startingPrice: z.number("Price must be a number").min(1, "Starting price must be greater than 0"),
  status: z.boolean().default(true).optional(),
  images: z
    .array(z.union([z.instanceof(File), z.string()]).nullable())
    .min(0, "Please upload at least one image")
    .max(4, "You can upload up to 4 images only"),
});

export type ServiceFormType = z.infer<typeof serviceSchema>;
