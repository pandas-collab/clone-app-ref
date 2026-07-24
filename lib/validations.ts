import { z } from 'zod';

// Base validation schemas
export const slugSchema = z.string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only');

export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const phoneSchema = z.string()
  .optional()
  .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), 'Please enter a valid phone number');

export const urlSchema = z.string()
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/.test(val), 'Please enter a valid URL starting with http:// or https://');

export const imageSchema = z.object({
  url: z.string().url('Please provide a valid image URL'),
  alt: z.string().min(1, 'Alt text is required for accessibility'),
  width: z.number().min(1).optional(),
  height: z.number().min(1).optional(),
});

// Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const newPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Admin authentication
export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

// User Management Schemas
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  role: z.enum(['ADMIN', 'USER']).default('USER'),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  role: z.enum(['ADMIN', 'USER']).optional(),
  isActive: z.boolean().optional(),
});

// Session and Token Schemas
export const sessionSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
    role: z.enum(['ADMIN', 'USER']),
    isActive: z.boolean(),
  }),
  expires: z.string(),
});

export const jwtTokenSchema = z.object({
  sub: z.string(), // user id
  email: z.string(),
  name: z.string().nullable(),
  role: z.enum(['ADMIN', 'USER']),
  isActive: z.boolean(),
  iat: z.number(),
  exp: z.number(),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
  budget: z.enum(['under-5k', '5k-10k', '10k-25k', '25k-50k', 'over-50k', 'not-sure']).optional(),
  timeline: z.enum(['asap', '1-month', '2-3-months', '3-6-months', '6-months-plus', 'not-sure']).optional(),
  services: z.array(z.string()).optional(),
});

// Service validation schemas
export const serviceFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: slugSchema,
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  longDescription: z.string().min(1, 'Long description is required').max(5000, 'Long description must be less than 5000 characters'),
  category: z.string().min(1, 'Category is required'),
  keyFeatures: z.array(z.string().min(1, 'Feature cannot be empty')).min(1, 'At least one key feature is required'),
  benefits: z.array(z.string().min(1, 'Benefit cannot be empty')).min(1, 'At least one benefit is required'),
  metaTitle: z.string().max(60, 'Meta title should be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description should be less than 160 characters').optional(),
  featuredImage: imageSchema.optional(),
  status: z.enum(['draft', 'published']),
  pricing: z.object({
    startingPrice: z.number().min(0, 'Starting price must be positive').optional(),
    priceType: z.enum(['fixed', 'hourly', 'project', 'custom']).optional(),
  }).optional(),
});

// Service Management Schemas
export const createServiceSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content cannot exceed 5000 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  icon: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

// Portfolio validation schemas
export const portfolioFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: slugSchema,
  clientName: z.string().min(1, 'Client name is required').max(100, 'Client name must be less than 100 characters'),
  clientLogo: imageSchema.optional(),
  industry: z.string().min(1, 'Industry is required'),
  servicesUsed: z.array(z.string().min(1, 'Service cannot be empty')).min(1, 'At least one service must be selected'),
  challenge: z.string().min(1, 'Challenge description is required').max(2000, 'Challenge must be less than 2000 characters'),
  solution: z.string().min(1, 'Solution description is required').max(2000, 'Solution must be less than 2000 characters'),
  results: z.string().min(1, 'Results description is required').max(2000, 'Results must be less than 2000 characters'),
  metrics: z.array(z.object({
    label: z.string().min(1, 'Metric label is required'),
    value: z.string().min(1, 'Metric value is required'),
    improvement: z.string().optional(),
  })).optional(),
  testimonial: z.object({
    quote: z.string().min(1, 'Testimonial quote is required').max(1000, 'Quote must be less than 1000 characters'),
    author: z.string().min(1, 'Author name is required'),
    position: z.string().min(1, 'Author position is required'),
    avatar: imageSchema.optional(),
  }).optional(),
  featuredImage: imageSchema.optional(),
  gallery: z.array(imageSchema).optional(),
  tags: z.array(z.string()).optional(),
  projectUrl: urlSchema,
  completedAt: z.date().optional(),
  status: z.enum(['draft', 'published']),
  metaTitle: z.string().max(60, 'Meta title should be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description should be less than 160 characters').optional(),
});

// Portfolio Management Schemas
export const createPortfolioSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content cannot exceed 5000 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  image: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  clientName: z.string().optional(),
  projectUrl: z.string().url().optional().or(z.literal('')),
  completedAt: z.date().optional(),
  isActive: z.boolean().default(true),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();

// Career validation schemas
export const jobFormSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(200, 'Title must be less than 200 characters'),
  slug: slugSchema,
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  description: z.string().min(1, 'Job description is required').max(5000, 'Description must be less than 5000 characters'),
  responsibilities: z.array(z.string().min(1, 'Responsibility cannot be empty')).min(1, 'At least one responsibility is required'),
  requirements: z.array(z.string().min(1, 'Requirement cannot be empty')).min(1, 'At least one requirement is required'),
  preferredQualifications: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  salaryRange: z.object({
    min: z.number().min(0, 'Minimum salary must be positive').optional(),
    max: z.number().min(0, 'Maximum salary must be positive').optional(),
    currency: z.string().default('USD').optional(),
  }).optional(),
  remote: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'closed']),
  applicationDeadline: z.date().optional(),
  metaTitle: z.string().max(60, 'Meta title should be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description should be less than 160 characters').optional(),
});

// Career Management Schemas
export const createCareerSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  department: z
    .string()
    .min(1, 'Department is required')
    .max(50, 'Department cannot exceed 50 characters'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location cannot exceed 100 characters'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  level: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'MANAGER']),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),
  requirements: z
    .string()
    .min(1, 'Requirements are required')
    .max(2000, 'Requirements cannot exceed 2000 characters'),
  responsibilities: z
    .string()
    .min(1, 'Responsibilities are required')
    .max(2000, 'Responsibilities cannot exceed 2000 characters'),
  benefits: z.string().optional(),
  salaryRange: z.string().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.date().optional(),
});

export const updateCareerSchema = createCareerSchema.partial();

// Job application validation schema
export const jobApplicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: emailSchema,
  phone: phoneSchema,
  location: z.string().min(1, 'Location is required'),
  linkedinUrl: urlSchema,
  portfolioUrl: urlSchema,
  resumeUrl: z.string().url('Please provide a valid resume URL'),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').max(2000, 'Cover letter must be less than 2000 characters'),
  experienceYears: z.number().min(0, 'Experience years cannot be negative').max(50, 'Experience years seems too high'),
  availability: z.enum(['immediately', '2-weeks', '1-month', '2-months', 'negotiable']),
  salaryExpectation: z.number().min(0, 'Salary expectation must be positive').optional(),
  remotePreference: z.enum(['on-site', 'hybrid', 'remote', 'flexible']),
  additionalInfo: z.string().max(1000, 'Additional info must be less than 1000 characters').optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' }),
  type: z.enum(['image', 'document', 'resume']),
  maxSize: z.number().optional(),
}).refine((data) => {
  const maxSize = data.maxSize || 10 * 1024 * 1024; // 10MB default
  return data.file.size <= maxSize;
}, 'File size exceeds the maximum allowed limit');

// Search and filter schemas
export const searchParamsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['draft', 'published', 'all']).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  total: z.number().min(0).optional(),
  totalPages: z.number().min(0).optional(),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  details: z.any().optional(),
});

export const apiSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
});

// ID Parameter Schema
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

// Utility functions for validation
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validateSlug = (slug: string): boolean => {
  return slugSchema.safeParse(slug).success;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Type exports for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type SessionData = z.infer<typeof sessionSchema>;
export type JwtTokenData = z.infer<typeof jwtTokenSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type PortfolioFormData = z.infer<typeof portfolioFormSchema>;
export type JobFormData = z.infer<typeof jobFormSchema>;
export type JobApplicationData = z.infer<typeof jobApplicationSchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
