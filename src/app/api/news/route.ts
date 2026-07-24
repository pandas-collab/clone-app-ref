import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    const skip = (page - 1) * limit;
    const where: any = {
      type: 'news',
      status: 'published'
    };

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (featured) {
      where.featured = true;
    }

    const [articles, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          author: true,
          publishedAt: true,
          category: true,
          tags: true,
          featured: true,
          metadata: true
        }
      }),
      prisma.content.count({ where })
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
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
      where: { slug, type: 'news' }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }

    const article = await prisma.content.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        description: data.description,
        type: 'news',
        category: data.category,
        status: data.status || 'draft',
        author: data.author || session.user.name,
        featured: data.featured || false,
        tags: data.tags,
        metadata: {
          ...data.metadata,
          readTime: calculateReadTime(data.content)
        },
        publishedAt: data.status === 'published' ? new Date() : null
      }
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('News creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
