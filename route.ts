import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { serviceSchema } from '@/lib/validations/service'

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password")
          }

          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            }
          })

          if (!user) {
            throw new Error("No user found with this email")
          }

          // Verify password
          const isPasswordValid = await compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }

          // Check if user is active
          if (!user.isActive) {
            throw new Error("Account is deactivated")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist user data in token
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isActive = user.isActive
      }
      
      // Refresh user data on each request
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string }
          })
          
          if (dbUser && dbUser.isActive) {
            token.role = dbUser.role
            token.isActive = dbUser.isActive
            token.name = dbUser.name
            token.email = dbUser.email
          } else {
            // User was deactivated or deleted
            return {}
          }
        } catch (error) {
          console.error("JWT callback error:", error)
          return {}
        }
      }
      
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isActive = token.isActive as boolean
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to admin dashboard after login
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // Redirect to admin if coming from login
      if (url === `${baseUrl}/admin/login`) {
        return `${baseUrl}/admin`
      }
      return baseUrl + "/admin"
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      try {
        if (user?.id) {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })
        }
      } catch (error) {
        console.error("Sign in event error:", error)
      }
    },
    async signOut({ token }) {
      // Log sign out event
      console.log(`User signed out: ${token?.email}`)
    }
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = serviceSchema.parse(body);

    // Generate slug from title if not provided
    const slug = validatedData.slug || validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug }
    });

    if (existingService) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 409 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        slug,
        image: validatedData.image || '',
        price: validatedData.price,
        features: validatedData.features || [],
        category: validatedData.category || 'general',
        isActive: validatedData.isActive ?? true
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid service data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

async function handler(
  req: NextRequest,
  context: { params: { nextauth: string[] } }
) {
  try {
    return await NextAuth(req as any, context as any, authOptions)
  } catch (error) {
    console.error("NextAuth handler error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export { handler as GET }
export { authOptions }
