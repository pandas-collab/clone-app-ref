import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Portfolio schemas
export const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  slug: z.string().min(1, 'Slug is required'),
  client: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  projectUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
});

export const caseStudySchema = z.object({
  technologies: z.array(z.string()),
  metrics: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })).optional(),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  content: z.string().min(1, 'Content is required'),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type CaseStudyInput = z.infer<typeof caseStudySchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
