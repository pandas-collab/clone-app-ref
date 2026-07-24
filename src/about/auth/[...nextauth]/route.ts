import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // For demo purposes - replace with actual database lookup
          const adminUser = {
            id: '1',
            email: 'admin@company.com',
            password: await bcrypt.hash('admin123', 10), // In real app, this would be stored hashed
            name: 'Admin User',
            role: 'admin'
          }

          if (credentials.email === adminUser.email) {
            const isValid = await bcrypt.compare(credentials.password, adminUser.password)

            if (isValid) {
              return {
                id: adminUser.id,
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role
              }
            }
          }

          return null
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/error',
  },
})

export { handler as GET, handler as POST }
