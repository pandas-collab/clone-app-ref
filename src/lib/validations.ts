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

export const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format");

export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .optional()
  .or(z.literal(''));

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens");

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

export const contactSchema = contactFormSchema;

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

export const serviceSchema = serviceFormSchema;

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

export const portfolioSchema = portfolioFormSchema;

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

export const careerSchema = careerFormSchema;

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

export const jobApplicationSchema = jobApplicationFormSchema;

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

// Register schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, "Name is required").optional(),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  email: emailSchema,
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: passwordSchema.optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword) {
    if (!data.currentPassword) {
      return false;
    }
    if (data.newPassword !== data.confirmNewPassword) {
      return false;
    }
    return passwordSchema.safeParse(data.newPassword).success;
  }
  return true;
}, {
  message: 'Password validation failed',
  path: ['newPassword'],
});

// Admin user schema
export const adminUserSchema = z.object({
  email: emailSchema,
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "user"]).default("user"),
  password: passwordSchema.optional(),
});

// Update profile schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: emailSchema.optional(),
  currentPassword: z.string().optional(),
  newPassword: passwordSchema.optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword) {
    if (!data.currentPassword) {
      return false;
    }
    if (data.newPassword !== data.confirmNewPassword) {
      return false;
    }
    return passwordSchema.safeParse(data.newPassword).success;
  }
  return true;
}, {
  message: 'Password validation failed',
  path: ['newPassword'],
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

// Search and filter validation schemas
export const searchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'title', 'updated']).optional().default('newest'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export const portfolioFilterSchema = searchParamsSchema.extend({
  technology: z.string().optional(),
  featured: z.coerce.boolean().optional(),
});

export const careerFilterSchema = searchParamsSchema.extend({
  department: z.string().optional(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).optional(),
  location: z.string().optional(),
});

// API validation schemas
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const slugParamSchema = z.object({
  slug: slugSchema,
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type CareerInput = z.infer<typeof careerSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
export type AdminUserInput = z.infer<typeof adminUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
export type PortfolioFilter = z.infer<typeof portfolioFilterSchema>;
export type CareerFilter = z.infer<typeof careerFilterSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type SlugParam = z.infer<typeof slugParamSchema>;

// Utility functions - keep both sets to preserve all behavior
export const validateSlug = (slug: string): boolean => {
  return slugSchema.safeParse(slug).success;
};

export const validateUrl = (url: string): boolean => {
  return urlSchema.safeParse(url).success;
};

export const sanitizeSearchQuery = (query: string): string => {
  return query.trim().toLowerCase().replace(/[^\w\s-]/g, '');
};

export const formatValidationError = (error: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });
  
  return formattedErrors;
};

export const validateFormData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: formatValidationError(result.error),
  };
};
