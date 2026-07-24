// ============================================================================
// Database Types - Career Management
// ============================================================================

export enum JobStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED'
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  INTERVIEWED = 'INTERVIEWED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED'
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE' | 'HYBRID';
  description: string;
  requirements: string[];
  benefits: string[];
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  applications?: JobApplication[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl: string;
  status: ApplicationStatus;
  submittedAt: Date;
  job?: JobPosting;
}

export interface CreateJobPostingData {
  title: string;
  department: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE' | 'HYBRID';
  description: string;
  requirements: string[];
  benefits: string[];
  status?: JobStatus;
}

export interface UpdateJobPostingData extends Partial<CreateJobPostingData> {}

export interface CreateJobApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeFile?: File;
}

export interface UpdateJobApplicationData {
  status: ApplicationStatus;
}

// Existing types from other agents (preserved)
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price?: number;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  technologies: string[];
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'RESOLVED';
  createdAt: Date;
  updatedAt: Date;
}
