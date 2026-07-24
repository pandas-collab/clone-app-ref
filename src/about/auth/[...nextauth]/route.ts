import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.password) {
            throw new Error("Password required")
          }

          // Check email-based login (admin@example.com)
          if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
            return {
              id: "1",
              email: "admin@example.com",
              name: "Admin User",
              role: "admin"
            }
          }

          // Check username-based login (admin)
          if (credentials.username === "admin" && credentials.password === "admin123") {
            return {
              id: "1",
              name: "Admin User",
              email: "admin@bourntec.com",
              role: "admin"
            }
          }

          throw new Error("Invalid credentials")
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
        ;(session.user as any).id = token.sub
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key"
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
