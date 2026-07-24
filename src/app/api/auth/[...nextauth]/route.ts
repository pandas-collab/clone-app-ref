import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Configure NextAuth handler
const handler = NextAuth(authOptions);

// Export GET and POST handlers for Next.js 13+ App Router
export { handler as GET, handler as POST };

// Export auth options for external use
export { authOptions };
