import { User as PrismaUser } from "@prisma/client"

export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  expires: string
}

export interface JWT {
  id: string
  email: string
  name: string
  role: string
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}
