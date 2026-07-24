import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchContent, buildSearchQuery } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Use utility function for search
    const results = await searchContent({
      query: query.trim(),
      type: type || undefined,
      limit,
      offset,
    });

    // Also search across different content types
    const [contentResults, serviceResults, portfolioResults, careerResults] = await Promise.all([
      // Content search (pages, articles, resources)
      prisma.content.findMany({
        where: buildSearchQuery(query.trim(), type),
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      // Service search
      type === 'service' || !type ? prisma.service.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: Math.floor(limit / 4),
      }) : [],
      // Portfolio search
      type === 'portfolio' || !type ? prisma.portfolio.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: Math.floor(limit / 4),
      }) : [],
      // Career search
      type === 'career' || !type ? prisma.career.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { requirements: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: Math.floor(limit / 4),
      }) : [],
    ]);

    const allResults = {
      content: contentResults,
      services: serviceResults,
      portfolio: portfolioResults,
      careers: careerResults,
      total: contentResults.length + serviceResults.length + portfolioResults.length + careerResults.length,
      query,
      type: type || 'all',
    };

    return NextResponse.json({ success: true, data: allResults });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, options } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Advanced search with filters
    const results = await searchContent({
      query: query.trim(),
      ...filters,
      ...options,
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json(
      { success: false, error: 'Advanced search failed' },
      { status: 500 }
    );
  }
}
