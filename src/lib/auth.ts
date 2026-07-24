import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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

export async function requireAuth() {
  const session = await getAuthSession()

  if (!session) {
    throw new Error("Authentication required")
  }

  return session
}

export async function requireAdminAuth() {
  const session = await requireAuth()

  if (session.user.role !== "ADMIN") {
    throw new Error("Admin access required")
  }

  return session
}
export { authOptions };
