// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio types
export interface Portfolio {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  client?: string;
  featured: boolean;
  published: boolean;
  images: string[];
  projectUrl?: string;
  githubUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  caseStudy?: CaseStudy;
  images_rel?: PortfolioImage[];
  testimonials?: ClientTestimonial[];
}

export interface CaseStudy {
  id: string;
  portfolioId: string;
  portfolio?: Portfolio;
  technologies: string[];
  metrics?: CaseStudyMetric[];
}

export interface CaseStudyMetric {
  id: string;
  caseStudyId: string;
  caseStudy?: CaseStudy;
  name: string;
  value: string;
  createdAt: Date;
}

export interface PortfolioImage {
  id: string;
  portfolioId: string;
  portfolio?: Portfolio;
  url: string;
  alt?: string;
  order: number;
}

export interface ClientTestimonial {
  id: string;
  portfolioId?: string;
  portfolio?: Portfolio;
  clientName: string;
  content: string;
  rating?: number;
  featured: boolean;
  approvedAt?: Date;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  metadata?: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Form types
export interface PortfolioFormData {
  title: string;
  description: string;
  category: string;
  slug: string;
  client?: string;
  featured: boolean;
  published: boolean;
  images: string[];
  projectUrl?: string;
  githubUrl?: string;
  caseStudy?: {
    technologies: string[];
    metrics?: {
      name: string;
      value: string;
    }[];
  };
}

export interface TestimonialFormData {
  clientName: string;
  content: string;
  rating?: number;
  featured: boolean;
  portfolioId?: string;
}
