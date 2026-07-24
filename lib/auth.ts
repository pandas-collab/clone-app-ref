if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required')
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() }
          })

          if (!user) {
            throw new Error('Invalid email or password')
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password)

          if (!isValidPassword) {
            throw new Error('Invalid email or password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        // Initial sign in
        if (account && user) {
          return {
            ...token,
            id: user.id,
            role: (user as AuthUser).role
          }
        }

        // Return previous token if the access token has not expired yet
        if (token.id) {
          // Verify user still exists and get updated info
          const existingUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { id: true, email: true, name: true, role: true }
          })

          if (!existingUser) {
            throw new Error('User not found')
          }

          return {
            ...token,
            id: existingUser.id,
            role: existingUser.role,
            email: existingUser.email,
            name: existingUser.name
          }
        }

        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token?.id) {
          const authSession: AuthSession = {
            ...session,
            user: {
              id: token.id as string,
              email: token.email as string,
              name: token.name as string,
              role: (token.role as 'ADMIN' | 'USER') || 'USER'
            }
          }
          return authSession
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { userId: user.id, email: user.email })
    },
    async signOut({ session, token }) {
      console.log('User signed out:', { userId: token?.id })
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

export async function createAdminUser(email: string, password: string, name: string): Promise<AuthUser> {
  try {
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name.trim(),
        role: 'ADMIN'
      }
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

export async function verifyAdminRole(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      return false
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    return user?.role === 'ADMIN'
  } catch (error) {
    console.error('Error verifying admin role:', error)
    return false
  }
}

export async function hashPassword(password: string): Promise<string> {
  try {
    if (!password) {
      throw new Error('Password is required')
    }
    return await bcrypt.hash(password, 12)
  } catch (error) {
    console.error('Error hashing password:', error)
    throw new Error('Failed to hash password')
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    if (!password || !hashedPassword) {
      return false
    }
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

export function requireAuth(session: Session | null): AuthSession {
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  return session as AuthSession
}

export function requireAdmin(session: Session | null): AuthSession {
  const authSession = requireAuth(session)
  if (authSession.user.role !== 'ADMIN') {
    throw new Error('Admin access required')
  }
  return authSession
}
