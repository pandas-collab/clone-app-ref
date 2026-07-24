import { z } from "zod";

// Basic validation functions for auth system
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

// Basic validation schemas
export const emailSchema = z.string().email("Invalid email address");

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format");

export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .optional()
  .or(z.literal(''));

export const statusSchema = z.enum(['active', 'inactive', 'pending', 'draft']);

// Contact form validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  phone: phoneSchema,
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  source: z
    .enum(['website', 'referral', 'social', 'other'])
    .optional(),
  priority: z
    .enum(['low', 'medium', 'high'])
    .default('medium')
    .optional()
});

// Service inquiry form validation
export const serviceFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  phone: phoneSchema,
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  serviceType: z.enum(['web-development', 'mobile-app', 'consulting', 'other'], {
    errorMap: () => ({ message: 'Please select a valid service type' })
  }),
  budget: z
    .string()
    .min(1, 'Budget range is required'),
  timeline: z
    .string()
    .min(1, 'Timeline is required'),
  description: z
    .string()
    .min(1, 'Project description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  requirements: z
    .string()
    .max(1000, 'Requirements must be less than 1000 characters')
    .optional(),
  attachments: z
    .array(z.string().url())
    .optional()
});

// Portfolio submission validation
export const portfolioFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  imageUrl: z
    .string()
    .url('Image URL must be valid')
    .min(1, 'Image is required'),
  projectUrl: urlSchema,
  technologies: z
    .array(z.string())
    .min(1, 'At least one technology is required')
    .max(10, 'Cannot exceed 10 technologies'),
  category: z.enum(['web', 'mobile', 'desktop', 'other'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  status: statusSchema.default('draft'),
  featured: z.boolean().default(false).optional(),
  completedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
});

// Career/Job posting validation
export const careerFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Job title is required')
    .max(200, 'Title must be less than 200 characters'),
  department: z
    .string()
    .min(1, 'Department is required')
    .max(100, 'Department must be less than 100 characters'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
  type: z.enum(['full-time', 'part-time', 'contract', 'intern'], {
    errorMap: () => ({ message: 'Please select a valid employment type' })
  }),
  level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive'], {
    errorMap: () => ({ message: 'Please select a valid experience level' })
  }),
  description: z
    .string()
    .min(1, 'Job description is required')
    .min(100, 'Description must be at least 100 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  requirements: z
    .string()
    .min(1, 'Requirements are required')
    .min(50, 'Requirements must be at least 50 characters')
    .max(3000, 'Requirements must be less than 3000 characters'),
  responsibilities: z
    .string()
    .min(1, 'Responsibilities are required')
    .min(50, 'Responsibilities must be at least 50 characters')
    .max(3000, 'Responsibilities must be less than 3000 characters'),
  salaryMin: z
    .number()
    .min(0, 'Minimum salary cannot be negative')
    .optional(),
  salaryMax: z
    .number()
    .min(0, 'Maximum salary cannot be negative')
    .optional(),
  benefits: z
    .string()
    .max(2000, 'Benefits must be less than 2000 characters')
    .optional(),
  skills: z
    .array(z.string())
    .min(1, 'At least one skill is required')
    .max(20, 'Cannot exceed 20 skills'),
  remote: z.boolean().default(false).optional(),
  status: statusSchema.default('draft'),
  applicationDeadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be in YYYY-MM-DD format')
    .optional()
}).refine(
  (data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  },
  {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['salaryMax']
  }
);

// Job application form validation
export const jobApplicationFormSchema = z.object({
  jobId: z
    .string()
    .min(1, 'Job ID is required'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: emailSchema,
  phone: phoneSchema,
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
  linkedinUrl: z
    .string()
    .url('LinkedIn URL must be valid')
    .optional()
    .or(z.literal('')),
  portfolioUrl: urlSchema,
  githubUrl: z
    .string()
    .url('GitHub URL must be valid')
    .optional()
    .or(z.literal('')),
  resumeUrl: z
    .string()
    .url('Resume URL must be valid')
    .min(1, 'Resume is required'),
  coverLetter: z
    .string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(2000, 'Cover letter must be less than 2000 characters')
    .optional(),
  experience: z
    .number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience cannot exceed 50'),
  expectedSalary: z
    .number()
    .min(0, 'Expected salary cannot be negative')
    .optional(),
  availableFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Available from date must be in YYYY-MM-DD format')
    .optional(),
  workAuthorization: z.enum(['citizen', 'permanent-resident', 'visa-required', 'other'], {
    errorMap: () => ({ message: 'Please select a valid work authorization status' })
  }),
  willingToRelocate: z.boolean().optional(),
  additionalInfo: z
    .string()
    .max(1000, 'Additional information must be less than 1000 characters')
    .optional()
});

// User validation schemas
export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]).default("user"),
  name: z.string().min(1, "Name is required").optional(),
});

// Admin login validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
});

// Legacy login schema validation functions
export const loginSchemaValidation = {
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

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please select a file' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
      'File must be an image (JPEG, PNG, WebP) or PDF'
    ),
  folder: z
    .string()
    .min(1, 'Folder is required')
    .max(50, 'Folder name must be less than 50 characters')
    .regex(/^[a-z0-9-_]+$/, 'Folder name can only contain lowercase letters, numbers, hyphens, and underscores')
});

// Image upload specific validation
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please select an image' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Image size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'File must be an image (JPEG, PNG, or WebP)'
    ),
  folder: z
    .string()
    .min(1, 'Folder is required')
    .max(50, 'Folder name must be less than 50 characters')
    .regex(/^[a-z0-9-_]+$/, 'Folder name can only contain lowercase letters, numbers, hyphens, and underscores')
});

// Search and filter validation
export const searchSchema = z.object({
  query: z
    .string()
    .max(100, 'Search query must be less than 100 characters')
    .optional(),
  category: z
    .string()
    .max(50, 'Category must be less than 50 characters')
    .optional(),
  status: statusSchema.optional(),
  sortBy: z
    .enum(['title', 'createdAt', 'updatedAt', 'status'])
    .optional(),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional(),
  page: z
    .number()
    .int('Page must be a whole number')
    .min(1, 'Page must be at least 1')
    .optional(),
  limit: z
    .number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
});

// Type exports for form data
export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type PortfolioFormData = z.infer<typeof portfolioFormSchema>;
export type CareerFormData = z.infer<typeof careerFormSchema>;
export type JobApplicationFormData = z.infer<typeof jobApplicationFormSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type ImageUploadData = z.infer<typeof imageUploadSchema>;
export type SearchParams = z.infer<typeof searchSchema>;

// Validation helper function
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: z.ZodError } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Get validation errors as flat object
export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
}

// Format validation error for display
export function formatValidationError(error: z.ZodError): string {
  return error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
}
