// Lead Management Database Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  source: string;
  status: LeadStatus;
  score: number;
  priority: LeadPriority;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  metadata?: Record<string, any>;
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  CLOSED = 'closed'
}

export enum LeadPriority {
  HOT = 'hot',
  WARM = 'warm',
  COLD = 'cold'
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface LeadScoringCriteria {
  companyEmail: number;
  phoneProvided: number;
  messageLengthBonus: number;
  keywordMatches: Record<string, number>;
  sourceWeights: Record<string, number>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  templateType: EmailTemplateType;
  variables: string[];
}

export enum EmailTemplateType {
  NEW_LEAD_NOTIFICATION = 'new_lead_notification',
  LEAD_CONFIRMATION = 'lead_confirmation',
  NURTURE_SEQUENCE = 'nurture_sequence',
  FOLLOW_UP = 'follow_up'
}

export interface ExportConfiguration {
  format: 'csv' | 'excel';
  fields: string[];
  filters: {
    status?: LeadStatus[];
    priority?: LeadPriority[];
    dateRange?: {
      start: Date;
      end: Date;
    };
    assignedTo?: string;
  };
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: ActivityType;
  description: string;
  performedBy?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export enum ActivityType {
  CREATED = 'created',
  STATUS_CHANGED = 'status_changed',
  EMAIL_SENT = 'email_sent',
  CONTACTED = 'contacted',
  NOTE_ADDED = 'note_added',
  ASSIGNED = 'assigned'
}

// Prisma-compatible model interfaces
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  assignedLeads?: Lead[];
}

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
  MANAGER = 'manager'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LeadListResponse extends PaginatedResponse<Lead> {
  filters: {
    status?: LeadStatus;
    priority?: LeadPriority;
    search?: string;
  };
}

export interface LeadStatsResponse extends ApiResponse {
  data: {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    averageScore: number;
    conversionRate: number;
    leadsBySource: Record<string, number>;
    leadsByPriority: Record<LeadPriority, number>;
  };
}
