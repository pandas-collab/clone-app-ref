if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty',
    });
  }
  prisma = global.prisma;
}

// Connection management for production
if (process.env.NODE_ENV === 'production') {
  prisma.$connect().catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

// Database health check utility
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Transaction wrapper with retry logic
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Check if error is retryable (connection issues, timeouts, etc.)
      const isRetryable = 
        error instanceof Error &&
        (error.message.includes('ECONNRESET') ||
         error.message.includes('ETIMEDOUT') ||
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('connection') ||
         error.message.includes('timeout'));

      if (!isRetryable) {
        throw error;
      }

      console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error);
      
      // Exponential backoff
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError!;
};

// Enhanced transaction wrapper
export const withTransaction = async <T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> => {
  return withRetry(async () => {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx as PrismaClient);
    }, {
      maxWait: 5000,
      timeout: 10000,
    });
  });
};

// Soft delete utility
export const softDelete = async (
  model: string,
  id: string | number
): Promise<boolean> => {
  try {
    const modelDelegate = (prisma as any)[model];
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`);
    }

    await modelDelegate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return true;
  } catch (error) {
    console.error(`Soft delete failed for ${model} with id ${id}:`, error);
    return false;
  }
};

// Restore soft deleted record
export const restoreSoftDeleted = async (
  model: string,
  id: string | number
): Promise<boolean> => {
  try {
    const modelDelegate = (prisma as any)[model];
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`);
    }

    await modelDelegate.update({
      where: { id },
      data: { deletedAt: null },
    });

    return true;
  } catch (error) {
    console.error(`Restore failed for ${model} with id ${id}:`, error);
    return false;
  }
};

// Batch operations utility
export const batchOperation = async <T>(
  items: T[],
  operation: (item: T) => Promise<any>,
  batchSize: number = 10
): Promise<any[]> => {
  const results: any[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(operation)
    );
    
    results.push(...batchResults);
    
    // Small delay between batches to prevent overwhelming the database
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
};

// Database cleanup utility for development/testing
export const cleanup = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cleanup is not allowed in production');
  }

  try {
    // Delete in order to respect foreign key constraints
    await prisma.testimonial.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.application.deleteMany();
    await prisma.career.deleteMany();
    await prisma.portfolioItem.deleteMany();
    await prisma.service.deleteMany();
    await prisma.navigationItem.deleteMany();
    await prisma.page.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.newsArticle.deleteMany();
    await prisma.user.deleteMany();

    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Database cleanup failed:', error);
    throw error;
  }
};

export default prisma;