import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const status = searchParams.get('status');
    const parent = searchParams.get('parent');

    const skip = (page - 1) * limit;
    const where: any = {
      type: 'page'
    };

    // Only show published pages to non-authenticated users
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      where.status = 'published';
    } else if (status) {
      where.status = status;
    }

    if (parent) {
      where.metadata = {
        path: ['parent'],
        equals: parent
      };
    }

    const [pages, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { metadata: { path: ['order'], sort: 'asc' } },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          status: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true
        }
      }),
      prisma.content.count({ where })
    ]);

    return NextResponse.json({
      pages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Pages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check for existing slug
    const existing = await prisma.content.findFirst({
      where: { slug, type: 'page' }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Page with this slug already exists' },
        { status: 400 }
      );
    }

    const page = await prisma.content.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        description: data.description,
        type: 'page',
        status: data.status || 'draft',
        metadata: {
          template: data.template || 'default',
          parent: data.parent || null,
          order: data.order || 0,
          seoTitle: data.seoTitle || data.title,
          seoDescription: data.seoDescription || data.description,
          showInMenu: data.showInMenu || false,
          ...data.metadata
        },
        publishedAt: data.status === 'published' ? new Date() : null
      }
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Page creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
