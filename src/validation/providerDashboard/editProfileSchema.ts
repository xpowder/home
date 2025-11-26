// components/providerDashboard/profile/editProfileSchema.ts
import * as z from "zod";

export const editProfileSchema = z.object({
  // Optional fields
  profileImage: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),

  fullName: z.string().optional().or(z.literal("")),
  
  // REQUIRED: Profession/Category
  profession: z.string().min(1, "Profession / Category is required"),
  
  bio: z.string().optional().or(z.literal("")),
  
  // REQUIRED: City
  city: z.string().min(1, "City / Location is required"),
  
  serviceArea: z.string().optional().or(z.literal("")),
  experience: z.string().optional().or(z.literal("")),
  startingPrice: z.number().min(0, "Starting price must be 0 or greater").optional(),
  languages: z.array(z.string()).optional(),
  phone: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  email: z
    .union([
      z.string().email("Enter a valid email"),
      z.literal(""),
    ])
    .optional(),

  serviceImage: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),

  portfolioImages: z
    .array(z.union([z.instanceof(File), z.string()]).nullable())
    .max(3, "You can upload up to 3 images")
    .optional(),
});

export type EditProfileFormType = z.infer<typeof editProfileSchema>;
