// /types/auth/signUpSchema.ts
import { z } from "zod";

export const signUpSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First Name must be at least 2 characters")
      .max(20, "First Name must be at most 20 characters"),

    last_name: z
      .string()
      .min(2, "Last Name must be at least 2 characters")
      .max(20, "Last Name must be at most 20 characters"),

    email: z
      .string()
      .min(1, "Email or phone is required")
      .refine(
        (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10,15}$/.test(val),
        "Please enter a valid email or phone"
      ),

    phone: z
      .string()
      .regex(
        /^(\+212|0)[5-7][0-9]{8}$/,
        "Phone number must be a valid Moroccan number (e.g., 0612345678 or +212612345678)"
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long"),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the Terms of Service and Privacy Policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // attach error to confirmPassword field
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
