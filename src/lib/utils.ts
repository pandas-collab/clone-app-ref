
// Search utility functions for content management
export interface SearchOptions {
  query: string;
  type?: string;
  limit?: number;
  offset?: number;
  published?: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  content?: string;
  description?: string;
  type: string;
  slug?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function searchContent(options: SearchOptions): Promise<SearchResult[]> {
  const { prisma } = await import('@/lib/prisma');
  const { query, type, limit = 20, offset = 0, published = true } = options;

  try {
    const searchTerms = query.split(' ').filter(term => term.length > 1);
    const searchConditions = searchTerms.map(term => ({
      OR: [
        { title: { contains: term, mode: 'insensitive' as const } },
        { content: { contains: term, mode: 'insensitive' as const } },
        { description: { contains: term, mode: 'insensitive' as const } },
      ],
    }));

    const where: any = {
      AND: searchConditions,
      published,
    };

    if (type && type !== 'all') {
      where.type = type;
    }

    const results = await prisma.content.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return results.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      description: item.description,
      type: item.type,
      slug: item.slug,
      url: getContentUrl(item.type, item.slug),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  } catch (error) {
    console.error('Search content error:', error);
    return [];
  }
}

export function buildSearchQuery(query: string, type?: string | null) {
  const searchTerms = query.split(' ').filter(term => term.length > 1);

  const baseConditions = {
    OR: [
      { title: { contains: query, mode: 'insensitive' as const } },
      { content: { contains: query, mode: 'insensitive' as const } },
      { description: { contains: query, mode: 'insensitive' as const } },
    ],
  };

  const conditions: any = baseConditions;

  if (type && type !== 'all') {
    conditions.type = type;
  }

  return conditions;
}

export function getContentUrl(type: string, slug: string): string {
  switch (type) {
    case 'service':
      return `/services/${slug}`;
    case 'portfolio':
      return `/portfolio/${slug}`;
    case 'career':
      return `/careers/${slug}`;
    case 'page':
      return `/${slug}`;
    case 'article':
      return `/articles/${slug}`;
    case 'resource':
      return `/resources/${slug}`;
    default:
      return `/${slug}`;
  }
}

export function highlightSearchTerms(text: string, query: string): string {
  if (!text || !query) return text;

  const searchTerms = query.split(' ').filter(term => term.length > 1);
  let highlightedText = text;

  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });

  return highlightedText;
}

export function generateSitemap(baseUrl: string = 'https://example.com'): Promise<string> {
  return new Promise(async (resolve) => {
    try {
      const { prisma } = await import('@/lib/prisma');

      // Get all published content
      const [content, services, portfolio, careers] = await Promise.all([
        prisma.content.findMany({ where: { published: true } }),
        prisma.service.findMany({ where: { published: true } }),
        prisma.portfolio.findMany({ where: { published: true } }),
        prisma.career.findMany({ where: { published: true } }),
      ]);

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

      // Add content URLs
      [...content, ...services, ...portfolio, ...careers].forEach(item => {
        const url = getContentUrl(item.type || 'page', item.slug);
        sitemap += `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

      sitemap += '\n</urlset>';
      resolve(sitemap);
    } catch (error) {
      console.error('Sitemap generation error:', error);
      resolve('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
    }
  });
}

export function generateResourceDownload(resourceId: string, format: 'csv' | 'json' | 'xml' = 'json') {
  return new Promise(async (resolve, reject) => {
    try {
      const { prisma } = await import('@/lib/prisma');

      const resource = await prisma.content.findUnique({
        where: { id: resourceId, type: 'resource' },
      });

      if (!resource) {
        reject(new Error('Resource not found'));
        return;
      }

      let content = '';
      let mimeType = '';
      let filename = `${resource.slug}.${format}`;

      switch (format) {
        case 'csv':
          content = `Title,Description,Content,Created\n"${resource.title}","${resource.description || ''}","${resource.content}","${resource.createdAt}"`;
          mimeType = 'text/csv';
          break;
        case 'xml':
          content = `<?xml version="1.0" encoding="UTF-8"?>
<resource>
  <title>${resource.title}</title>
  <description>${resource.description || ''}</description>
  <content><![CDATA[${resource.content}]]></content>
  <created>${resource.createdAt}</created>
</resource>`;
          mimeType = 'application/xml';
          break;
        default:
          content = JSON.stringify(resource, null, 2);
          mimeType = 'application/json';
      }

      resolve({ content, mimeType, filename });
    } catch (error) {
      reject(error);
    }
  });
}
