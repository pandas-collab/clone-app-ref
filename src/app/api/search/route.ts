import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchContent } from '@/lib/utils';

// GET - Search across all content types
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    let results = [];

    if (!type || type === 'all') {
      // Search across all content types
      const [articles, resources, pages] = await Promise.all([
        prisma.article.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } }
            ],
            published: true
          },
          take: Math.ceil(limit / 3),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.resource.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } }
            ]
          },
          take: Math.ceil(limit / 3),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.page.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } }
            ],
            published: true
          },
          take: Math.ceil(limit / 3),
          orderBy: { createdAt: 'desc' }
        })
      ]);

      results = [
        ...articles.map(item => ({ ...item, type: 'news' })),
        ...resources.map(item => ({ ...item, type: 'resource' })),
        ...pages.map(item => ({ ...item, type: 'page' }))
      ];
    } else {
      // Search specific content type
      switch (type) {
        case 'news':
          const articles = await prisma.article.findMany({
            where: {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
                { excerpt: { contains: query, mode: 'insensitive' } }
              ],
              published: true
            },
            take: limit,
            orderBy: { createdAt: 'desc' }
          });
          results = articles.map(item => ({ ...item, type: 'news' }));
          break;
        case 'resource':
          const resources = await prisma.resource.findMany({
            where: {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { category: { contains: query, mode: 'insensitive' } }
              ]
            },
            take: limit,
            orderBy: { createdAt: 'desc' }
          });
          results = resources.map(item => ({ ...item, type: 'resource' }));
          break;
        case 'page':
          const pages = await prisma.page.findMany({
            where: {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } }
              ],
              published: true
            },
            take: limit,
            orderBy: { createdAt: 'desc' }
          });
          results = pages.map(item => ({ ...item, type: 'page' }));
          break;
        default:
          return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
      }
    }

    // Use search utility for additional processing if available
    const processedResults = await searchContent(results, query);

    return NextResponse.json({
      query,
      total: processedResults.length,
      results: processedResults.slice(0, limit)
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Advanced search with filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters = {}, limit = 10, offset = 0 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const whereConditions = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ]
    };

    // Apply additional filters
    if (filters.published !== undefined) {
      whereConditions.published = filters.published;
    }
    if (filters.dateFrom) {
      whereConditions.createdAt = { gte: new Date(filters.dateFrom) };
    }
    if (filters.dateTo) {
      whereConditions.createdAt = { ...whereConditions.createdAt, lte: new Date(filters.dateTo) };
    }

    let results = [];
    const searchPromises = [];

    if (!filters.type || filters.type.includes('news')) {
      searchPromises.push(
        prisma.article.findMany({
          where: whereConditions,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }).then(items => items.map(item => ({ ...item, type: 'news' })))
      );
    }

    if (!filters.type || filters.type.includes('resource')) {
      const resourceWhere = { ...whereConditions };
      if (filters.category) {
        resourceWhere.category = { contains: filters.category, mode: 'insensitive' };
      }
      searchPromises.push(
        prisma.resource.findMany({
          where: resourceWhere,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }).then(items => items.map(item => ({ ...item, type: 'resource' })))
      );
    }

    if (!filters.type || filters.type.includes('page')) {
      searchPromises.push(
        prisma.page.findMany({
          where: whereConditions,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }).then(items => items.map(item => ({ ...item, type: 'page' })))
      );
    }

    const searchResults = await Promise.all(searchPromises);
    results = searchResults.flat();

    return NextResponse.json({
      query,
      filters,
      total: results.length,
      results: results.slice(0, limit)
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
