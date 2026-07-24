// Service types
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCreateInput {
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  featured?: boolean;
  published?: boolean;
}

export interface ServiceUpdateInput {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  image?: string;
  featured?: boolean;
  published?: boolean;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  image?: string;
  isAdmin?: boolean;
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
  content?: string;
  image?: string;
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

// Career types
export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
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

// Lead and contact form related types
export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  source: string
  status: LeadStatus
  score: number
  createdAt: Date
  updatedAt: Date
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  CLOSED = 'closed'
}

export interface LeadScore {
  id: string
  leadId: string
  score: number
  factors: ScoreFactor[]
  calculatedAt: Date
}

export interface ScoreFactor {
  name: string
  value: number
  weight: number
}

export interface EmailNotification {
  id: string
  leadId: string
  type: NotificationType
  recipient: string
  subject: string
  body: string
  sentAt: Date
  status: EmailStatus
}

export enum NotificationType {
  LEAD_CREATED = 'lead_created',
  LEAD_UPDATED = 'lead_updated',
  FOLLOW_UP = 'follow_up'
}

export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed'
}
