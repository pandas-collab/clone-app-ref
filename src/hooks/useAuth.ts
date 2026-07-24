'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { AuthUser, LoginCredentials, AuthResponse } from '@/types/auth';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const user: AuthUser | null = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name || undefined,
    role: session.user.role
  } : null;

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);

      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      });

      if (result?.error) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      if (result?.ok) {
        // Redirect to admin dashboard after successful login
        router.push('/admin');
        router.refresh();

        return {
          success: true,
          message: 'Login successful'
        };
      }

      return {
        success: false,
        error: 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut({
        redirect: false,
        callbackUrl: '/admin/login'
      });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any): Promise<AuthResponse> => {
    // Registration logic would be implemented here
    // For now, return not implemented
    return {
      success: false,
      error: 'Registration not implemented'
    };
  };

  const isAdmin = (): boolean => {
    return user?.role === 'ADMIN';
  };

  const hasAccess = (resource: string): boolean => {
    if (!user) return false;

    // Admin has access to everything
    if (user.role === 'ADMIN') return true;

    // Regular users have limited access
    return false;
  };

  const isAuthenticated = (): boolean => {
    return !!user && status === 'authenticated';
  };

  const isLoading = (): boolean => {
    return status === 'loading' || loading;
  };

  return {
    user,
    loading: isLoading(),
    login,
    logout,
    register,
    isAdmin,
    hasAccess,
    isAuthenticated,
    session,
    status
  };
}

// Helper hook for requiring authentication
export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();

  if (!auth.loading && !auth.isAuthenticated()) {
    router.push('/admin/login');
    return null;
  }

  return auth;
}

// Helper hook for requiring admin access
export function useRequireAdmin() {
  const auth = useAuth();
  const router = useRouter();

  if (!auth.loading) {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return null;
    }

    if (!auth.isAdmin()) {
      router.push('/admin');
      return null;
    }
  }

  return auth;
}
