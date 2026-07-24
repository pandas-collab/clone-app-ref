// Lead Management Types
export interface Lead {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  message: string;
  status: LeadStatus;
  score: number;
  source: string;
  budget?: string;
  timeline?: string;
  services?: string[];
  priority?: LeadPriority;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: LeadNote[];
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
export type LeadPriority = 'low' | 'medium' | 'high';
export type NoteType = 'general' | 'status_change' | 'score_update' | 'follow_up' | 'meeting';

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  type: NoteType;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  source?: string;
  budget?: string;
  timeline?: string;
  services?: string[];
}

export interface LeadScoreCriteria {
  hasCompany: boolean;
  hasPhone: boolean;
  messageLength: number;
  source: string;
  budget?: string;
  timeline?: string;
  servicesCount: number;
  engagementLevel?: number;
  companySize?: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: string;
  priority?: LeadPriority;
  assignedTo?: string;
  minScore?: number;
  maxScore?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface LeadExportOptions {
  format: 'json' | 'csv';
  filters?: LeadFilters;
  includeNotes?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Email Notification Types
export interface EmailNotificationData {
  type: 'new_lead' | 'status_change' | 'follow_up' | 'lead_welcome';
  lead: Lead;
  to: string;
  previousStatus?: LeadStatus;
  newStatus?: LeadStatus;
  customMessage?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Form Validation Types
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  budget?: string;
  timeline?: string;
  services?: string[];
  source?: string;
}

export interface LeadUpdateData {
  status?: LeadStatus;
  notes?: string;
  assignedTo?: string;
  priority?: LeadPriority;
}

// Dashboard Statistics Types
export interface LeadStatistics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageScore: number;
  leadsBySource: Record<string, number>;
  leadsByStatus: Record<LeadStatus, number>;
  monthlyTrends: {
    month: string;
    leads: number;
    conversions: number;
  }[];
}

// Existing types (keeping for compatibility)
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  price?: number;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  images: string[];
  client?: string;
  projectUrl?: string;
  technologies: string[];
  category: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  applications?: JobApplication[];
}

export interface JobApplication {
  id: string;
  careerId: string;
  name: string;
  email: string;
  phone?: string;
  resume: string;
  coverLetter?: string;
  status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'hired';
  createdAt: Date;
  updatedAt: Date;
  career?: Career;
}
