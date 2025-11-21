import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine(
      (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10,15}$/.test(val),
      "Please enter a valid email or phone"
    ),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
