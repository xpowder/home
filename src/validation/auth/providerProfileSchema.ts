import { z } from "zod";

export const providerProfileSchema = z.object({
  service_category: z.string().min(1, "Please select a service category"),
  service_title: z.string().min(3, "Service title must be at least 3 characters"),
  years_experience: z.number().min(0, "Cannot be negative"),
  city: z.string().min(1, "Please select your city"),
  full_address: z.string().min(5, "Address must be at least 5 characters"),
  starting_price_mad: z.number().min(0, "Cannot be negative"),
  bio: z.string().min(20, "Short bio must be at least 20 characters"),

  // Apply .max() BEFORE .optional()
  profile_photo: z
    .instanceof(File)
    .nullable()
    .refine((file) => file instanceof File, "Please upload a profile photo")
    .optional(),

  portfolio_images: z
    .array(z.instanceof(File).nullable())
    .max(3, "You can upload up to 3 images") // ✅ max first
    .optional(), // then make it optional
});

export type ProviderProfileForm = z.infer<typeof providerProfileSchema>;
