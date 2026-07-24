import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { searchContent, searchByContentType } from '@/lib/utils';

const prisma = new PrismaClient();

// GET - Search across all content types with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const status = searchParams.get('status') || 'published';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    let results;

    if (type) {
      // Search within specific content type
      results = await searchByContentType(type, {
        status,
        limit,
        offset
      });
    } else {
      // Global search across all content types
      results = await searchContent(query, {
        type,
        status,
        limit,
        offset
      });
    }

    return NextResponse.json({
      query,
      ...results,
      pagination: {
        page,
        limit,
        total: results.total,
        pages: Math.ceil(results.total / limit)
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

// POST - Advanced search with complex filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      filters = {},
      sort = { field: 'createdAt', order: 'desc' },
      page = 1,
      limit = 10
    } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;
    const whereClause: any = {
      status: filters.status || 'published',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } }
      ]
    };

    if (filters.type) {
      whereClause.type = filters.type;
    }

    if (filters.authorId) {
      whereClause.authorId = filters.authorId;
    }

    if (filters.dateFrom || filters.dateTo) {
      whereClause.createdAt = {};
      if (filters.dateFrom) {
        whereClause.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        whereClause.createdAt.lte = new Date(filters.dateTo);
      }
    }

    const orderBy: any = {};
    orderBy[sort.field] = sort.order;

    const results = await prisma.content.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy
    });

    const total = await prisma.content.count({
      where: whereClause
    });

    return NextResponse.json({
      query,
      filters,
      results,
      total,
      hasMore: total > offset + limit,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json(
      { error: 'Advanced search failed' },
      { status: 500 }
    );
  }
}
