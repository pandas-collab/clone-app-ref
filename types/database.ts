export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string | null;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceInput {
  title: string;
  description: string;
  content: string;
  image?: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateServiceInput {
  title?: string;
  description?: string;
  content?: string;
  image?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  metadata?: Record<string, any>;
}

export interface ServiceFilters {
  category?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  search?: string;
}

export interface ServiceQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  filters?: ServiceFilters;
}

export interface ServiceResponse {
  services: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  remote: boolean;
  active: boolean;
  featured: boolean;
  applicationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  careerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resume: string;
  coverLetter?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  images: string[];
  category: string;
  tags: string[];
  client?: string;
  projectDate: Date;
  featured: boolean;
  published: boolean;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryOptions extends PaginationOptions {
  sort?: SortOptions;
  filters?: Record<string, any>;
}

export interface QueryResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  createdAt: Date;
}