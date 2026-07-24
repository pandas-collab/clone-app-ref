import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Extended user type for authentication
 */
export interface User extends DefaultUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User roles in the system
 */
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}

/**
 * Extended session type
 */
export interface Session extends DefaultSession {
  user: {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    isActive: boolean;
  };
  expires: string;
}

/**
 * Extended JWT token type
 */
export interface AuthToken extends JWT {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  iat?: number;
  exp?: number;
  jti?: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

/**
 * Password reset request interface
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation interface
 */
export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * User creation interface for admin
 */
export interface CreateUserRequest {
  email: string;
  name?: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * User update interface for admin
 */
export interface UpdateUserRequest {
  id: string;
  email?: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Auth middleware configuration
 */
export interface AuthMiddlewareConfig {
  publicRoutes: string[];
  adminRoutes: string[];
  loginPage: string;
  afterLoginUrl: string;
  afterLogoutUrl: string;
}

/**
 * Auth provider configuration
 */
export interface AuthProviderConfig {
  secret: string;
  sessionMaxAge: number;
  sessionUpdateAge: number;
  jwtMaxAge: number;
  verificationTokenMaxAge: number;
}

/**
 * Auth error types
 */
export enum AuthError {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_INACTIVE = "USER_INACTIVE",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",
  RATE_LIMITED = "RATE_LIMITED"
}

/**
 * Auth context interface
 */
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Role-based access control interface
 */
export interface RolePermissions {
  [key: string]: {
    read: boolean;
    write: boolean;
    delete: boolean;
    admin: boolean;
  };
}

/**
 * Session validation result
 */
export interface SessionValidationResult {
  isValid: boolean;
  user?: User;
  error?: AuthError;
}

/**
 * Auth guard props
 */
export interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Login form validation schema type
 */
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Password strength validation result
 */
export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
}