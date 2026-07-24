if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Connection management functions
export async function connectToPrisma(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    throw new Error('Database connection failed');
  }
}

export async function disconnectFromPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✅ Successfully disconnected from database');
  } catch (error) {
    console.error('❌ Failed to disconnect from database:', error);
  }
}

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Transaction wrapper with error handling
export async function withTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx);
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

// Generic error handler for Prisma operations
export function handlePrismaError(error: any): never {
  if (error.code === 'P2002') {
    throw new Error('A record with this data already exists');
  }
  
  if (error.code === 'P2025') {
    throw new Error('Record not found');
  }
  
  if (error.code === 'P2003') {
    throw new Error('Foreign key constraint failed');
  }
  
  if (error.code === 'P2016') {
    throw new Error('Query interpretation error');
  }
  
  if (error.code === 'P1001') {
    throw new Error('Cannot reach database server');
  }
  
  if (error.code === 'P1002') {
    throw new Error('Database server timeout');
  }
  
  // Generic database error
  console.error('Prisma error:', error);
  throw new Error('Database operation failed');
}

// Utility function for safe database operations
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage || 'Database operation failed:', error);
    handlePrismaError(error);
  }
}

// Pagination helper
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export function getPaginationParams(options: PaginationOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 10));
  const skip = (page - 1) * limit;
  
  return {
    skip,
    take: limit,
    page,
    limit,
  };
}

// Search helper for full-text search
export function buildSearchFilter(
  query: string,
  fields: string[]
): Record<string, any> {
  if (!query.trim()) return {};
  
  const searchTerms = query.trim().split(' ').filter(term => term.length > 0);
  
  return {
    OR: fields.flatMap(field =>
      searchTerms.map(term => ({
        [field]: {
          contains: term,
          mode: 'insensitive' as const,
        },
      }))
    ),
  };
}

// Soft delete helper
export async function softDelete(
  model: keyof PrismaClient,
  id: string | number
): Promise<void> {
  try {
    await (prisma[model] as any).update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

// Restore soft deleted record
export async function restoreDeleted(
  model: keyof PrismaClient,
  id: string | number
): Promise<void> {
  try {
    await (prisma[model] as any).update({
      where: { id },
      data: { deletedAt: null },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

// Default export
export default prisma;