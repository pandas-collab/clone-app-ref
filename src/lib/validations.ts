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

// Utility functions
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

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