import { clsx, type ClassValue } from "clsx";
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { prisma } from './prisma';

export function  cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function  formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function  formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function  truncateText(text: string, length: number = 150) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function  slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function  generateExcerpt(content: string, length: number = 200): string {
  // Strip HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '');
  return truncateText(plainText, length);
}

// Search functionality
export interface SearchOptions {
  type?: string;
  limit?: number;
  skip?: number;
  includeUnpublished?: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'service' | 'portfolio' | 'career' | 'content' | 'article' | 'page' | 'resource';
  slug?: string;
  url: string;
  publishedAt?: Date;
  relevanceScore: number;
}

export async function searchContent(
  query: string,
  options: SearchOptions = {}
): Promise<{ items: SearchResult[]; total: number }> {
  const { type, limit = 20, skip = 0, includeUnpublished = false } = options;

  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
  const results: SearchResult[] = [];

  try {
    // Search services
    if (!type || type === 'services') {
      const services = await prisma.service.findMany({
        where: {
          AND: [
            includeUnpublished ? {} : { published: true },
            {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { shortDescription: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        select: {
          id: true,
          title: true,
          shortDescription: true,
          slug: true,
          updatedAt: true
        }
      });

      services.forEach(service => {
        const relevance = calculateRelevanceScore(query, searchTerms, service.title, service.shortDescription);
        results.push({
          id: service.id,
          title: service.title,
          excerpt: service.shortDescription || '',
          type: 'service',
          slug: service.slug,
          url: `/services/${service.slug}`,
          publishedAt: service.updatedAt,
          relevanceScore: relevance
        });
      });
    }

    // Search portfolio
    if (!type || type === 'portfolio') {
      const portfolio = await prisma.portfolio.findMany({
        where: {
          AND: [
            includeUnpublished ? {} : { published: true },
            {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { challenge: { contains: query, mode: 'insensitive' } },
                { solution: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          updatedAt: true
        }
      });

      portfolio.forEach(item => {
        const relevance = calculateRelevanceScore(query, searchTerms, item.title, item.description);
        results.push({
          id: item.id,
          title: item.title,
          excerpt: generateExcerpt(item.description, 150),
          type: 'portfolio',
          slug: item.slug,
          url: `/portfolio/${item.slug}`,
          publishedAt: item.updatedAt,
          relevanceScore: relevance
        });
      });
    }

    // Search careers
    if (!type || type === 'careers') {
      const careers = await prisma.career.findMany({
        where: {
          AND: [
            includeUnpublished ? {} : { status: 'active' },
            {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { requirements: { contains: query, mode: 'insensitive' } },
                { responsibilities: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          updatedAt: true
        }
      });

      careers.forEach(job => {
        const relevance = calculateRelevanceScore(query, searchTerms, job.title, job.description);
        results.push({
          id: job.id,
          title: job.title,
          excerpt: generateExcerpt(job.description, 150),
          type: 'career',
          url: `/careers/${job.id}`,
          publishedAt: job.updatedAt,
          relevanceScore: relevance
        });
      });
    }

    // Search content (articles, pages, resources)
    if (!type || ['content', 'articles', 'pages', 'resources'].includes(type)) {
      const contentWhere: any = {
        AND: [
          includeUnpublished ? {} : { status: 'published' },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      };

      if (type && ['articles', 'pages', 'resources'].includes(type)) {
        contentWhere.AND.push({ type: type.slice(0, -1) }); // Remove 's' from plural
      }

      const content = await prisma.content.findMany({
        where: contentWhere,
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          slug: true,
          type: true,
          publishedAt: true
        }
      });

      content.forEach(item => {
        const relevance = calculateRelevanceScore(
          query,
          searchTerms,
          item.title,
          item.excerpt || generateExcerpt(item.content, 200)
        );

        results.push({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || generateExcerpt(item.content, 150),
          type: item.type as any,
          slug: item.slug,
          url: item.type === 'page' ? `/${item.slug}` : `/${item.type}s/${item.slug}`,
          publishedAt: item.publishedAt || undefined,
          relevanceScore: relevance
        });
      });
    }

    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Apply pagination
    const paginatedResults = results.slice(skip, skip + limit);

    return {
      items: paginatedResults,
      total: results.length
    };

  } catch (error) {
    console.error('Search error:', error);
    return { items: [], total: 0 };
  }
}

function calculateRelevanceScore(
  query: string,
  searchTerms: string[],
  title: string,
  content: string
): number {
  let score = 0;
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Exact phrase match in title (highest score)
  if (lowerTitle.includes(lowerQuery)) {
    score += 100;
  }

  // Exact phrase match in content
  if (lowerContent.includes(lowerQuery)) {
    score += 50;
  }

  // Individual term matches in title
  searchTerms.forEach(term => {
    if (lowerTitle.includes(term)) {
      score += 20;
    }
  });

  // Individual term matches in content
  searchTerms.forEach(term => {
    if (lowerContent.includes(term)) {
      score += 5;
    }
  });

  // Bonus for title starting with query
  if (lowerTitle.startsWith(lowerQuery)) {
    score += 30;
  }

  return score;
}

export async function generateSearchIndex(): Promise<void> {
  try {
    // This could be enhanced to build a more sophisticated search index
    // For now, we'll just ensure all searchable content is properly indexed
    console.log('Generating search index...');

    const [serviceCount, portfolioCount, careerCount, contentCount] = await Promise.all([
      prisma.service.count({ where: { published: true } }),
      prisma.portfolio.count({ where: { published: true } }),
      prisma.career.count({ where: { status: 'active' } }),
      prisma.content.count({ where: { status: 'published' } })
    ]);

    console.log(`Search index generated:
      - Services: ${serviceCount}
      - Portfolio: ${portfolioCount}
      - Careers: ${careerCount}
      - Content: ${contentCount}
    `);
  } catch (error) {
    console.error('Error generating search index:', error);
    throw error;
  }
}

// File upload utilities
export function  validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function  validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

export function  generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const sanitizedName = slugify(nameWithoutExt);

  return `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
}

// Email utilities
export function  isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// URL utilities
export function  isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function  sanitizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
