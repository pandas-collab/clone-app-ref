// Core database model types for the consulting agency platform

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: string;
  technologies: string[];
  clientName?: string;
  projectUrl?: string;
  featured: boolean;
  published: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  level: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryMin?: number;
  salaryMax?: number;
  remote: boolean;
  active: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  applications?: JobApplication[];
}

export interface JobApplication {
  id: string;
  careerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  status: 'PENDING' | 'REVIEWING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  notes?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  career?: Career;
}

// Lead management types for contact form and CRM integration
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  message: string;
  source: 'CONTACT_FORM' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'SEARCH' | 'ADVERTISEMENT' | 'OTHER';
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATING' | 'WON' | 'LOST' | 'NURTURING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  score: number; // Lead scoring value (0-100)
  interestedServices: string[]; // Array of service IDs or names
  budget?: string;
  timeline?: string;
  notes?: string;
  assignedTo?: string; // User ID of assigned salesperson
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  qualifiedAt?: Date;
  convertedAt?: Date;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  interactions?: LeadInteraction[];
}

export interface LeadInteraction {
  id: string;
  leadId: string;
  type: 'EMAIL' | 'CALL' | 'MEETING' | 'NOTE' | 'PROPOSAL' | 'CONTRACT';
  direction: 'INBOUND' | 'OUTBOUND';
  subject?: string;
  content: string;
  duration?: number; // In minutes for calls/meetings
  outcome?: string;
  createdBy: string; // User ID
  scheduledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  lead?: Lead;
}

export interface LeadSource {
  id: string;
  name: string;
  type: 'ORGANIC' | 'PAID' | 'REFERRAL' | 'SOCIAL' | 'DIRECT' | 'EMAIL' | 'OTHER';
  description?: string;
  active: boolean;
  trackingCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'EMAIL' | 'SOCIAL' | 'PPC' | 'CONTENT' | 'REFERRAL' | 'EVENT';
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  targetAudience?: string;
  goals: string[];
  metrics: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
  leads?: Lead[];
}

// Contact form submission types
export interface ContactFormSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  message: string;
  interestedServices?: string[];
  budget?: string;
  timeline?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  consent: boolean;
  newsletter: boolean;
}

// Lead scoring configuration
export interface LeadScoringRule {
  id: string;
  name: string;
  description: string;
  field: string; // Field to evaluate (email, company, etc.)
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex' | 'exists';
  value?: string;
  score: number; // Points to add/subtract
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadScoringProfile {
  leadId: string;
  totalScore: number;
  scoreBreakdown: Array<{
    ruleId: string;
    ruleName: string;
    points: number;
    appliedAt: Date;
  }>;
  lastCalculatedAt: Date;
}

// Email notification types
export interface EmailTemplate {
  id: string;
  name: string;
  type: 'LEAD_NOTIFICATION' | 'WELCOME' | 'FOLLOW_UP' | 'PROPOSAL' | 'NEWSLETTER';
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[]; // Available template variables
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailLog {
  id: string;
  to: string;
  from: string;
  subject: string;
  templateId?: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'FAILED';
  errorMessage?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Database query and filter types
export interface LeadFilters {
  status?: Lead['status'][];
  priority?: Lead['priority'][];
  source?: Lead['source'][];
  assignedTo?: string[];
  dateRange?: {
    field: 'createdAt' | 'lastContactedAt' | 'qualifiedAt' | 'convertedAt';
    start: Date;
    end: Date;
  };
  scoreRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  hasEmail?: boolean;
  hasPhone?: boolean;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Export statistics and analytics types
export interface LeadAnalytics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageScore: number;
  leadsPerDay: number;
  topSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  statusDistribution: Array<{
    status: Lead['status'];
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    leads: number;
    qualified: number;
    converted: number;
  }>;
}

export interface ExportRequest {
  id: string;
  type: 'LEADS' | 'APPLICATIONS' | 'INTERACTIONS';
  format: 'CSV' | 'EXCEL' | 'PDF';
  filters: Record<string, any>;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  downloadUrl?: string;
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
}

// Database connection and transaction types
export interface DatabaseError {
  code: string;
  message: string;
  field?: string;
  value?: any;
}

export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: DatabaseError;
  metadata?: Record<string, any>;
}

export interface BulkOperation<T> {
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: T[];
  options?: {
    skipValidation?: boolean;
    upsert?: boolean;
    transaction?: boolean;
  };
}

export interface BulkResult<T> {
  success: boolean;
  processed: number;
  failed: number;
  results: Array<{
    index: number;
    success: boolean;
    data?: T;
    error?: DatabaseError;
  }>;
}