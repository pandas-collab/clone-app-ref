import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchContent, generateSearchIndex } from '@/lib/utils';

// GET - Global search across all content types
export async function GET(request: NextRequest: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // services, portfolio, careers, content
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const results = await searchContent(query, { type, limit, skip });

    return NextResponse.json({
      query,
      results: results.items,
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

// POST - Rebuild search index (admin only)
export async function POST(request: NextRequest: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action === 'reindex') {
      await generateSearchIndex();
      return NextResponse.json({
        message: 'Search index rebuilt successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Search index error:', error);
    return NextResponse.json(
      { error: 'Failed to rebuild search index' },
      { status: 500 }
    );
  }
}
