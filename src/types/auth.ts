import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export interface User extends DefaultUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session extends DefaultSession {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  expires: string;
}

export interface AuthSession {
  user: User;
  expires: string;
}

export interface AuthToken extends JWT {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  isActive: boolean;
  accessToken?: string;
  refreshToken?: string;
  exp?: number;
  iat?: number;
  jti?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetCredentials {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthError {
  type: AuthErrorType;
  message: string;
  code?: string;
}

export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_INACTIVE = 'USER_INACTIVE',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR'
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  updateProfile: (data: Partial<User>) => Promise<AuthResponse>;
  changePassword: (credentials: ChangePasswordCredentials) => Promise<AuthResponse>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<AuthResponse>;
  resetPassword: (credentials: PasswordResetCredentials) => Promise<AuthResponse>;
  refreshSession: () => Promise<void>;
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requireRole?: UserRole | UserRole[];
  redirectTo?: string;
  publicPaths?: string[];
  adminPaths?: string[];
}

export interface JWTPayload {
  sub: string;
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  exp: number;
  iat: number;
  jti?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  exp: number;
  iat: number;
}

export interface SessionData {
  user: User;
  expires: string;
  accessToken?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthAction {
  type: AuthActionType;
  payload?: any;
}

export enum AuthActionType {
  LOGIN_START = 'LOGIN_START',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_ERROR = 'LOGIN_ERROR',
  LOGOUT = 'LOGOUT',
  REGISTER_START = 'REGISTER_START',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_ERROR = 'REGISTER_ERROR',
  UPDATE_PROFILE_START = 'UPDATE_PROFILE_START',
  UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS',
  UPDATE_PROFILE_ERROR = 'UPDATE_PROFILE_ERROR',
  REFRESH_SESSION_START = 'REFRESH_SESSION_START',
  REFRESH_SESSION_SUCCESS = 'REFRESH_SESSION_SUCCESS',
  REFRESH_SESSION_ERROR = 'REFRESH_SESSION_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  SET_LOADING = 'SET_LOADING'
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: UserRole | UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}
