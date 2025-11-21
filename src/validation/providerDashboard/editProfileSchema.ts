// components/providerDashboard/profile/editProfileSchema.ts
import * as z from "zod";

export const editProfileSchema = z.object({
  profileImage: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .refine(
      (file) => file !== null && (file instanceof File || typeof file === "string"),
      "Please upload a profile photo"
    ),

  fullName: z.string().min(2, "Full name is required"),
  profession: z.string().min(1, "Profession is required"),
  bio: z.string().min(10, "Please provide a short bio"),
  city: z.string().min(1, "City is required"),
  serviceArea: z.string().optional(),
  experience: z.string().min(1, "Experience is required"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  phone: z.string().min(5, "Phone number required"),
  whatsapp: z.string().optional(),
  email: z.string().email("Enter a valid email"),

  serviceImage: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .refine(
      (file) => file !== null && (file instanceof File || typeof file === "string"),
      "Please upload a service or work photo"
    ),

  portfolioImages: z
    .array(z.union([z.instanceof(File), z.string()]).nullable())
    .min(0, "Add at least one image")
    .max(3, "You can upload up to 3 images"),
});

export type EditProfileFormType = z.infer<typeof editProfileSchema>;
