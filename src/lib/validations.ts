import { z } from "zod"

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// Service schemas
export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  image: z.string().url().optional(),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
})

export const serviceCreateSchema = serviceSchema.omit({ slug: true })

// Portfolio schemas
export const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  image: z.string().url().optional(),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
})

// Career schemas
export const careerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE"]),
  published: z.boolean().optional().default(true),
})

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

// Application schema
export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  coverLetter: z.string().min(1, "Cover letter is required"),
  resume: z.string().url("Resume URL is required"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>
export type PortfolioInput = z.infer<typeof portfolioSchema>
export type CareerInput = z.infer<typeof careerSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
