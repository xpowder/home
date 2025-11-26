// schemas/loginSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine(
      (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10,15}$/.test(val),
      "Please enter a valid email or phone"
    ),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters long"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
