import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to combine class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Search content processing function
export async function searchContent(results: any[], query: string) {
  if (!results || results.length === 0) {
    return [];
  }

  // Sort results by relevance
  const scoredResults = results.map(item => {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Title matches get higher score
    if (item.title?.toLowerCase().includes(lowerQuery)) {
      score += 10;
      if (item.title?.toLowerCase().startsWith(lowerQuery)) {
        score += 5; // Bonus for starting with query
      }
    }

    // Content matches
    if (item.content?.toLowerCase().includes(lowerQuery)) {
      score += 5;
    }

    // Excerpt/description matches
    if (item.excerpt?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)) {
      score += 3;
    }

    // Category matches for resources
    if (item.category?.toLowerCase().includes(lowerQuery)) {
      score += 7;
    }

    return { ...item, relevanceScore: score };
  });

  // Sort by relevance score (highest first), then by date
  return scoredResults.sort((a, b) => {
    if (a.relevanceScore !== b.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// Extract search highlights from content
export function extractSearchHighlights(text: string, query: string, maxLength: number = 200) {
  if (!text || !query) return '';

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const queryIndex = lowerText.indexOf(lowerQuery);

  if (queryIndex === -1) {
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  // Extract context around the match
  const start = Math.max(0, queryIndex - 50);
  const end = Math.min(text.length, queryIndex + query.length + 50);

  let excerpt = text.substring(start, end);
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';

  return excerpt;
}

// Generate sitemap data from content
export async function generateSitemapData() {
  try {
    // This would typically import prisma, but we'll return structure for now
    const sitemapData = {
      static: [
        { url: '/', priority: 1.0, changefreq: 'daily' },
        { url: '/about', priority: 0.8, changefreq: 'weekly' },
        { url: '/services', priority: 0.9, changefreq: 'weekly' },
        { url: '/portfolio', priority: 0.9, changefreq: 'weekly' },
        { url: '/careers', priority: 0.7, changefreq: 'weekly' },
        { url: '/contact', priority: 0.6, changefreq: 'monthly' }
      ],
      dynamic: []
    };

    return sitemapData;
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return { static: [], dynamic: [] };
  }
}

// Format date for display
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Generate slug from title
export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

// Truncate text to specified length
export function truncateText(text: string, length: number) {
  if (text.length <= length) return text;
  return text.substring(0, length).replace(/\s+\S*$/, '') + '...';
}
