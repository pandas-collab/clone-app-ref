import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { NextAuth } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';
import { CustomUser, CustomSession, CustomJWT } from '../types/auth';
import { getServerSession } from "next-auth"

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
      isActive: boolean;
      image?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    isActive: boolean;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    isActive: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing email or password')
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase()
            }
          })

          if (!user) {
            throw new Error('Invalid credentials')
          }

          if (!user.isActive) {
            throw new Error('Account is deactivated')
          }

          const isPasswordValid = await compare(credentials.password, user.password || '')

          if (!isPasswordValid) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            image: user.image,
          } as CustomUser

        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
    secret: process.env.NEXTAUTH_SECRET
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user && trigger === 'signIn') {
        const customUser = user as CustomUser
        token.id = customUser.id
        token.role = customUser.role
        token.isActive = customUser.isActive
      }

      // Update session
      if (trigger === 'update' && session) {
        token.role = session.role || token.role
        token.isActive = session.isActive !== undefined ? session.isActive : token.isActive
      }

      // Verify user is still active and exists
      if (token.id) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              isActive: true,
              image: true
            }
          })

          if (!user || !user.isActive) {
            return {}
          }

          // Update token with fresh data
          token.email = user.email
          token.role = user.role
          token.isActive = user.isActive
        } catch (error) {
          console.error('JWT callback error:', error)
          return {}
        }
      }

      return token as CustomJWT
    },

    async session({ session, token }) {
      if (token && token.id) {
        const customToken = token as CustomJWT
        const customSession: CustomSession = {
          ...session,
          user: {
            id: customToken.id,
            email: customToken.email as string,
            name: session.user.name,
            role: customToken.role,
            isActive: customToken.isActive,
            image: session.user.image
          }
        }
        return customSession
      }

      return session
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email)
      
      // Update last login timestamp
      if (user.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })
        } catch (error) {
          console.error('Failed to update last login:', error)
        }
      }
    },

    async signOut({ session, token }) {
      console.log('User signed out:', token?.email || session?.user?.email)
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getAuthSession() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return null
  }

  return {
    ...session,
    user: {
      ...session.user,
      id: (session.user as any).id,
      role: (session.user as any).role,
    }
  }
}

export const getServerAuthSession = async () => {
  return await NextAuth(authOptions).getServerSession()
}

export const requireAuth = async (): Promise<CustomSession> => {
  const session = await getServerAuthSession() as CustomSession

  if (!session || !session.user) {
    throw new Error('Authentication required')
  }

  if (!session.user.isActive) {
    throw new Error('Account is deactivated')
  }

  return session
}

export async function requireAdminAuth() {
  const session = await getAuthSession()

  if (!session) {
    throw new Error("Authentication required")
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Admin access required")
  }

  return session
}

export const isAdmin = (session: CustomSession | null): boolean => {
  return !!(session?.user?.role === 'ADMIN' && session?.user?.isActive)
}

export const hasPermission = (
  session: CustomSession | null,
  requiredRole: 'ADMIN' | 'USER' = 'USER'
): boolean => {
  if (!session?.user?.isActive) return false

  if (requiredRole === 'ADMIN') {
    return session.user.role === 'ADMIN'
  }

  return ['ADMIN', 'USER'].includes(session.user.role)
}

export default NextAuth(authOptions)
