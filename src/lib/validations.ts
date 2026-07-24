import { z } from "zod";
// Basic validation functions for auth system
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const loginSchema = {
  email: (value: string) => {
    if (!value) return 'Email is required';
    if (!validateEmail(value)) return 'Invalid email format';
    return null;
  },
  password: (value: string) => {
    if (!value) return 'Password is required';
    if (!validatePassword(value)) return 'Password must be at least 8 characters';
    return null;
  }
};

export type LoginFormData = {
  email: string;
  password: string;
};

// User validation schemas
export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]).default("user"),
  name: z.string().min(1, "Name is required").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
