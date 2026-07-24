export interface Service {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  image?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    author?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceInput {
  title: string;
  description: string;
  content: string;
  slug?: string;
  image?: string;
  featured?: boolean;
  status?: 'draft' | 'published';
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    author?: string;
  };
}

export interface UpdateServiceInput {
  title?: string;
  description?: string;
  content?: string;
  slug?: string;
  image?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    author?: string;
  };
}

export interface ServiceFilters {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ServiceResponse {
  services: Service[];
  total: number;
  hasMore: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ServiceValidationErrors {
  title?: ValidationError[];
  description?: ValidationError[];
  content?: ValidationError[];
  slug?: ValidationError[];
  image?: ValidationError[];
  status?: ValidationError[];
  metadata?: ValidationError[];
}