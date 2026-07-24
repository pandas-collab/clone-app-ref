// Next.js App Router type definitions for admin careers delete page
import type { Metadata } from 'next';

// Page component type for admin careers delete page
export type AdminCareersDeletePageProps = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Default export type for the page component
export type AdminCareersDeletePage = (props: AdminCareersDeletePageProps) => Promise<JSX.Element>;

// Metadata generation function type
export type GenerateMetadata = (props: AdminCareersDeletePageProps) => Promise<Metadata>;

// Career deletion form data type
export type CareerDeleteFormData = {
  id: string;
  confirmation: boolean;
  reason?: string;
};

// Career deletion confirmation type
export type CareerDeleteConfirmation = {
  careerId: string;
  careerTitle: string;
  applicationsCount: number;
  deletedAt: Date;
};

// Career deletion error type
export type CareerDeleteError = {
  code: 'NOT_FOUND' | 'HAS_APPLICATIONS' | 'UNAUTHORIZED' | 'SERVER_ERROR';
  message: string;
  details?: unknown;
};

// Career deletion response type
export type CareerDeleteResponse = {
  success: boolean;
  data?: CareerDeleteConfirmation;
  error?: CareerDeleteError;
};

// Page state type for delete confirmation
export type DeletePageState = {
  career: {
    id: string;
    title: string;
    description: string;
    department: string;
    location: string;
    type: string;
    status: string;
    applicationsCount: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  isLoading: boolean;
  isDeleting: boolean;
  error: string | null;
  showConfirmation: boolean;
};

// Action types for delete page state management
export type DeletePageAction = 
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: DeletePageState['career'] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'DELETE_START' }
  | { type: 'DELETE_SUCCESS' }
  | { type: 'DELETE_ERROR'; payload: string }
  | { type: 'SHOW_CONFIRMATION' }
  | { type: 'HIDE_CONFIRMATION' }
  | { type: 'RESET_ERROR' };

// Form validation schema type
export type DeleteFormValidation = {
  isValid: boolean;
  errors: {
    confirmation?: string;
    general?: string;
  };
};