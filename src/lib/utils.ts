import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Search content across all types
export async function searchContent(query: string, options?: {
  type?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const {
    type,
    status = 'published',
    limit = 10,
    offset = 0
  } = options || {};

  const whereClause: any = {
    status,
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } }
    ]
  };

  if (type) {
    whereClause.type = type;
  }

  try {
    const results = await prisma.content.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.content.count({
      where: whereClause
    });

    return {
      results,
      total,
      hasMore: total > offset + limit
    };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Search failed');
  }
}

// Search by specific content type
export async function searchByContentType(type: string, options?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const {
    status = 'published',
    limit = 10,
    offset = 0
  } = options || {};

  try {
    const results = await prisma.content.findMany({
      where: {
        type,
        status
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.content.count({
      where: { type, status }
    });

    return {
      results,
      total,
      hasMore: total > offset + limit
    };
  } catch (error) {
    console.error('Content type search error:', error);
    throw new Error('Content type search failed');
  }
}

// Generate sitemap data
export async function generateSitemapData() {
  try {
    const content = await prisma.content.findMany({
      where: {
        status: 'published'
      },
      select: {
        slug: true,
        type: true,
        updatedAt: true
      }
    });

    return content.map(item => ({
      url: `/${item.type === 'page' ? '' : item.type + '/'}${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: item.type === 'page' ? 'monthly' : 'weekly',
      priority: item.type === 'page' ? 0.8 : 0.6
    }));
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return [];
  }
}
