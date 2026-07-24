import { User as PrismaUser, Role } from '@prisma/client';

// Extended User type for authentication
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

// Login form data
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register form data
export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}

// Session user type
export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

// Auth response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  error?: string;
}

// Password reset types
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  password: string;
}

// API response for authentication
export interface AuthApiResponse {
  user?: AuthUser;
  token?: string;
  message?: string;
  error?: string;
}

// Role-based access types
export type AdminOnlyResource = 'services' | 'portfolio' | 'careers' | 'applications' | 'users';

export interface AuthContext {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  isAdmin: () => boolean;
  hasAccess: (resource: AdminOnlyResource) => boolean;
}

// JWT payload structure
export interface JWTPayload {
  id: string;
  email: string;
  name?: string;
  role: Role;
  iat?: number;
  exp?: number;
}

// Middleware auth requirements
export interface AuthRequirement {
  requireAuth: boolean;
  requireAdmin: boolean;
  allowedRoles?: Role[];
  redirectTo?: string;
}
